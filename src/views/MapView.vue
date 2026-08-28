<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

import 'maplibre-gl/dist/maplibre-gl.css'
import {
  LngLatBounds,
  Map,
  Marker,
  MercatorCoordinate,
  NavigationControl,
  Popup,
  setWorkerUrl,
  type GeoJSONSourceSpecification,
} from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

import { useEncounterStore } from '@/stores/encounter'
import { useSaveStore } from '@/stores/save'
import { formatNumber } from '@/util'
import {
  DungeonType,
  LocationType,
  MapType,
  type MapLocation,
  type ProcessedEncounter,
  type World,
} from '@/model/types'
import { mapLocations } from '@/model/map-locations'

import { useRouteQuery } from '@vueuse/router'
import { useRoute } from 'vue-router'

import dungeonMapsLandsBetween from '@/assets/maps/dungeon-maps-lands-between.geojson.json'
import dungeonMapsLandOfShadow from '@/assets/maps/dungeon-maps-land-of-shadow.geojson.json'

import markerSvg from '@/assets/img/map/marker.svg?raw'

setWorkerUrl(workerUrl)

const saveStore = useSaveStore()
const { defeatedFlags } = storeToRefs(saveStore)

const encounterStore = useEncounterStore()
const route = useRoute()

const bossFilter = useRouteQuery<string>('bossFilter', 'all')
const showDungeons = ref<boolean>(true)
const showMapOptions = ref<boolean>(true)
const showLegend = ref<boolean>(true)

const popupTarget = ref<HTMLElement | null>(null)
const popupEncounter = ref<ProcessedEncounter | null>(null)
const markerMap = ref<Record<number, Marker>>({})

const worlds: World[] = [
  {
    name: 'Lands Between Overworld',
    map: MapType.LANDS_BETWEEN,
    tiles: 'https://andi.bar/maps/lands-between-overworld/{z}/{y}/{x}.png',
    width: 9389,
    height: 9119,
  },
  {
    name: 'Lands Between Underground',
    map: MapType.UNDERGROUND,
    tiles: 'https://andi.bar/maps/lands-between-underground/{z}/{y}/{x}.png',
    width: 9389,
    height: 9119,
  },
  {
    name: 'Land of Shadow',
    map: MapType.LAND_OF_SHADOW,
    tiles: 'https://andi.bar/maps/land-of-shadow/{z}/{y}/{x}.png',
    width: 4879,
    height: 5940,
  },
]

const TILE_SIZE = 256
const SOURCE_ID = 'world'
const LAYER_ID = 'world-layer'

const currentIndex = useRouteQuery('mapType', 0, { transform: Number })
const markerPopupActive = ref<boolean>(false)
const mapEl = ref<HTMLDivElement | null>(null)

let map: Map | null = null

function setBossMarkers(filter: string) {
  bossFilter.value = filter

  if (filter === 'all') {
    for (const marker of Object.values(markerMap.value)) {
      marker.setOpacity(1)
      marker.getElement().style.pointerEvents = ''
    }
  } else if (filter === 'defeated') {
    for (const [key, marker] of Object.entries(markerMap.value)) {
      const defeated = defeatedFlags.value.has(parseInt(key))
      if (defeated) {
        marker.setOpacity(1)
        marker.getElement().style.pointerEvents = ''
      } else {
        marker.setOpacity(0)
        marker.getElement().style.pointerEvents = 'none'
      }
    }
  } else if (filter === 'undefeated') {
    for (const [key, marker] of Object.entries(markerMap.value)) {
      const defeated = defeatedFlags.value.has(parseInt(key))
      if (defeated) {
        marker.setOpacity(0)
        marker.getElement().style.pointerEvents = 'none'
      } else {
        marker.setOpacity(1)
        marker.getElement().style.pointerEvents = ''
      }
    }
  } else if (filter === 'none') {
    for (const marker of Object.values(markerMap.value)) {
      marker.setOpacity(0)
      marker.getElement().style.pointerEvents = 'none'
    }
  }
}

function toggleDungeons() {
  if (map != null) {
    showDungeons.value = !showDungeons.value
    const visibility = showDungeons.value ? 'visible' : 'none'
    map.setLayoutProperty('shapes-fill', 'visibility', visibility)
    map.setLayoutProperty('shapes-line', 'visibility', visibility)
  }
}

function geometryFor(world: World): { maxZoom: number; bounds: LngLatBounds } {
  const maxZoom = Math.ceil(Math.log2(Math.max(world.width, world.height) / TILE_SIZE))
  const worldPx = TILE_SIZE * Math.pow(2, maxZoom)
  const nw = new MercatorCoordinate(0, 0).toLngLat()
  const se = new MercatorCoordinate(world.width / worldPx, world.height / worldPx).toLngLat()
  return { maxZoom, bounds: new LngLatBounds([nw.lng, se.lat], [se.lng, nw.lat]) }
}

function getMarkerColor(location: MapLocation): string {
  if (
    location.dungeonType == null ||
    location.dungeonType === DungeonType.RUINS ||
    location.dungeonType === DungeonType.EVERGAOL
  ) {
    return getComputedStyle(document.documentElement).getPropertyValue('--highlight-color')
  } else {
    return getComputedStyle(document.documentElement).getPropertyValue('--highlight-color-dark')
  }
}

function createMap(world: World, htmlElement: HTMLDivElement, maxZoom: number, bounds: LngLatBounds): Map {
  return new Map({
    container: htmlElement,
    attributionControl: false,
    transformConstrain: (lngLat, zoom) => {
      let transformedZoom = zoom ?? 0

      if (zoom > maxZoom) {
        transformedZoom = maxZoom
      } else if (zoom < 0) {
        transformedZoom = 0
      }

      if (lngLat.lng < bounds.getWest()) {
        lngLat.lng = bounds.getWest()
      } else if (lngLat.lng > bounds.getEast()) {
        lngLat.lng = bounds.getEast()
      }

      return { center: lngLat, zoom: transformedZoom }

      // return { center: lngLat, zoom: zoom ?? 0 }
    },
    style: {
      version: 8,
      sources: {
        [SOURCE_ID]: {
          type: 'raster',
          tiles: [world.tiles],
          tileSize: TILE_SIZE,
          minzoom: 0,
          maxzoom: maxZoom,
          bounds: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
        },
      },
      layers: [{ id: LAYER_ID, type: 'raster', source: SOURCE_ID }],
    },
    center: bounds.getCenter(),
    // zoom: 0,
    minZoom: 0,
    maxZoom,
    bounds: bounds,
    // maxBounds: bounds,
    renderWorldCopies: false,
    doubleClickZoom: false,
  }).addControl(
    new NavigationControl({
      visualizePitch: true,
      visualizeRoll: true,
      showZoom: true,
      showCompass: true,
    }),
  )
}

function addMarkers(map: Map, world: World) {
  for (const location of mapLocations) {
    if (location.mapType === world.map && location.lngLat != null) {
      if (location.locationType === LocationType.BOSS) {
        const encounter = encounterStore.encounters.find((e) => e.flagId === location.id)

        if (encounter != null) {
          const container = document.createElement('div')

          const popup = new Popup({ offset: 25, className: 'popup' }).setDOMContent(container)
          const defeated = defeatedFlags.value.has(encounter.flagId)

          popup.on('open', () => {
            popupTarget.value = container
            popupEncounter.value = encounter
          })

          popup.on('close', () => {
            if (popupEncounter.value?.flagId === encounter.flagId) {
              popupTarget.value = null
              popupEncounter.value = null
            }
          })

          const hover = new Popup({ offset: 25, closeButton: false, closeOnMove: true })
            .setText(location.name + (defeated ? ' ✓' : ''))
            .setLngLat(location.lngLat)

          const marker = new Marker({
            color: getMarkerColor(location),
            className: 'marker',
            // opacity: showBossMarkers.value ? 100 : 0,
          })
            .setLngLat(location.lngLat)
            .setPopup(popup)
            .addTo(map)

          const markerElement = marker.getElement()

          markerElement.addEventListener('mouseenter', () => {
            if (!popup.isOpen() && map != null) {
              hover.addTo(map)
              markerPopupActive.value = true
            }
          })

          markerElement.addEventListener('mouseleave', () => {
            hover.remove()
            markerPopupActive.value = false
          })

          markerMap.value[location.id] = marker
        }
      }
    }
  }
  setBossMarkers(bossFilter.value)
}

function applyWorld(index: number): void {
  const world = worlds[index]

  if (mapEl.value != null && world != null && (currentIndex.value !== index || map == null)) {
    currentIndex.value = index

    const { maxZoom, bounds } = geometryFor(world)

    map?.remove()
    markerMap.value = {}

    map = createMap(world, mapEl.value, maxZoom, bounds)
    addMarkers(map, world)

    map.on('load', () => {
      if (map != null) {
        if (world.map === MapType.LANDS_BETWEEN) {
          loadGeoJsonData(map, dungeonMapsLandsBetween)
        } else if (world.map === MapType.LAND_OF_SHADOW) {
          loadGeoJsonData(map, dungeonMapsLandOfShadow)
        }
      }
    })

    map.on('click', (e) => {
      const lng = e.lngLat.lng
      const lat = e.lngLat.lat
      console.log(`${lng}, ${lat}`)
    })
  }
}

function flyTo(id: number) {
  if (id != null && map != null) {
    const marker = markerMap.value[id]
    if (marker != null) {
      map.flyTo({
        center: marker.getLngLat(),
        zoom: 4,
        speed: 1.5,
        essential: true,
      })

      if (!marker.getPopup()?.isOpen()) {
        marker.togglePopup()
      }
    }
  }
}

function loadGeoJsonData(map: Map, data: GeoJSONSourceSpecification['data']) {
  const popupOverlay = new Popup({ closeButton: false, closeOnClick: false, offset: 12, closeOnMove: true })
  let hoveredId: string | number | undefined

  map.addSource('shapes', { type: 'geojson', data, promoteId: 'id' })

  map.addLayer({
    id: 'shapes-fill',
    type: 'fill',
    source: 'shapes',
    paint: {
      'fill-color': [
        // 'case',
        // ['boolean', ['feature-state', 'hover'], false],
        // 'pink',
        // [
        'match',
        ['get', 'dungeonType'],
        'CAVE',
        '#e74c3c',
        'GROTTO',
        '#e74c3c',
        'TUNNEL',
        '#e67e22',
        'CATACOMBS',
        '#3498db',
        'GAOL',
        '#1abc9c',
        'HEROS_GRAVE',
        '#f1c40f',
        /* Fallback */ '#2ecc71',
        // ],
      ],
      'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.7],
    },
    layout: {
      visibility: showDungeons.value ? 'visible' : 'none',
    },
  })

  map.addLayer({
    id: 'shapes-line',
    type: 'line',
    source: 'shapes',
    paint: {
      'line-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#e74c3c', '#333'],
      'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 1, 1],
    },
    layout: {
      visibility: showDungeons.value ? 'visible' : 'none',
    },
  })

  map.on('mousemove', 'shapes-fill', (e) => {
    if (e.features?.[0] != null && !markerPopupActive.value) {
      // map.getCanvas().style.cursor = 'pointer'

      if (hoveredId != null) {
        map.setFeatureState({ source: 'shapes', id: hoveredId }, { hover: false })
      }

      hoveredId = e.features[0].id
      map.setFeatureState({ source: 'shapes', id: hoveredId }, { hover: true })
      popupOverlay.setLngLat(e.lngLat).setText(e.features[0].properties.name).addTo(map)
    }
  })

  map.on('mouseleave', 'shapes-fill', () => {
    // map.getCanvas().style.cursor = ''

    if (hoveredId != null) {
      map.setFeatureState({ source: 'shapes', id: hoveredId }, { hover: false })
    }

    hoveredId = undefined
    popupOverlay.remove()
  })
}

onMounted(() => {
  const id = Number(route.params.id)

  if (id != null) {
    const location = mapLocations.find((l) => l.id === id)

    if (location != null) {
      switch (location.mapType) {
        case MapType.UNDERGROUND:
          currentIndex.value = 1
          break
        case MapType.LAND_OF_SHADOW:
          currentIndex.value = 2
          break
      }
    }
  }

  applyWorld(currentIndex.value)

  if (id != null) {
    flyTo(id)
  }
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>

<template>
  <div class="map-wrapper">
    <div class="map-overlay map-options">
      <div class="map-overlay-header" @click="showMapOptions = !showMapOptions">
        <div class="map-overlay-header-headline">{{ $t('mapOptions') }}</div>
        <div
          class="expand-icon"
          :style="{ transform: showMapOptions ? 'rotate(180deg)' : '', 'padding-top': showMapOptions ? '0.2rem' : '' }"
        >
          ▼
        </div>
      </div>
      <div class="collapsible__wrapper" :class="{ 'is-open': showMapOptions }">
        <div class="collapsible__inner">
          <div class="map-overlay-group">
            <div class="map-overlay-headline">{{ $t('map') }}</div>
            <div class="map-options-buttons filter-group filter-group-connected">
              <button
                v-for="(world, i) in worlds"
                :key="world.name"
                class="button toggle-button"
                :class="{ active: i === currentIndex }"
                @click="applyWorld(i)"
              >
                {{ world.name }}
              </button>
            </div>
          </div>

          <div class="map-overlay-group">
            <div class="map-overlay-headline">{{ $t('bosses') }} ({{ Object.keys(markerMap).length }})</div>
            <div class="map-options-buttons filter-group filter-group-connected">
              <button
                class="button toggle-button"
                :class="{ active: bossFilter === 'all' }"
                @click="setBossMarkers('all')"
              >
                {{ $t('all') }}
              </button>
              <button
                class="button toggle-button"
                :class="{ active: bossFilter === 'defeated' }"
                @click="setBossMarkers('defeated')"
              >
                {{ $t('defeatedOnly') }}
              </button>
              <button
                class="button toggle-button"
                :class="{ active: bossFilter === 'undefeated' }"
                @click="setBossMarkers('undefeated')"
              >
                {{ $t('undefeatedOnly') }}
              </button>
              <button
                class="button toggle-button"
                :class="{ active: bossFilter === 'none' }"
                @click="setBossMarkers('none')"
              >
                {{ $t('none') }}
              </button>
            </div>
          </div>

          <div class="map-overlay-group">
            <div class="map-overlay-headline">{{ $t('dungeons') }}</div>
            <div class="map-options-buttons">
              <button class="button toggle-button" :class="{ active: showDungeons }" @click="toggleDungeons">
                {{ $t('showHide') }}
              </button>
            </div>
          </div>
        </div>

        <!-- <div class="marker-switcher">
        <div class="toggle">
          <div>{{ $t('bosses') }} ({{ Object.keys(markerMap).length }})</div>
          <button class="button toggle-button" :class="{ active: showBossMarkers }" @click="toggleBossMarkers"></button>
        </div>
        <div class="toggle">
          <div>Dungeons</div>
          <button class="button toggle-button" :class="{ active: showDungeons }" @click="toggleDungeons"></button>
        </div> -->
        <!-- <div v-for="(marker, key) of markerMap" :key="key">
          {{ key }}
        </div> -->
        <!-- </div> -->
      </div>
    </div>

    <div class="map-overlay map-legend">
      <div class="map-overlay-group">
        <div class="map-overlay-header" @click="showLegend = !showLegend">
          <div class="map-overlay-header-headline">{{ $t('legend') }}</div>
          <div
            class="expand-icon"
            :style="{ transform: showLegend ? 'rotate(180deg)' : '', 'padding-top': showLegend ? '0.2rem' : '' }"
          >
            ▼
          </div>
        </div>
        <div class="collapsible__wrapper" :class="{ 'is-open': showLegend }">
          <div class="collapsible__inner">
            <div class="legend-row">
              <div class="legend-marker legend-marker-default" v-html="markerSvg"></div>
              <div>{{ $t('overworldBoss') }}</div>
            </div>
            <div class="legend-row">
              <div class="legend-marker legend-marker-dungeon" v-html="markerSvg"></div>
              <div>{{ $t('dungeonBoss') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div ref="mapEl" class="map"></div>
  </div>

  <Teleport v-if="popupTarget && popupEncounter" :to="popupTarget">
    <div>
      <div>
        <strong>{{ popupEncounter.flagName }} (Lvl. {{ popupEncounter.level }})</strong>
      </div>
      <div>&mdash; {{ popupEncounter.location }}</div>
      <div>{{ $t(popupEncounter.type?.replaceAll(' ', '')?.toLocaleLowerCase()) }}</div>
      <div>{{ $t('runes') }}: {{ formatNumber(popupEncounter.runes) }}</div>
      <div v-if="popupEncounter.drops">{{ $t('drops') }}: {{ popupEncounter.drops?.join(', ') }}</div>
      <div>
        <RouterLink :to="{ name: 'boss-detail', params: { flagId: popupEncounter.flagId } }">{{
          $t('bossDetails')
        }}</RouterLink>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.map-wrapper {
  position: relative;
  margin: -1rem;
  height: calc(100dvh - 3.5rem);
}

.map {
  width: 100%;
  height: 100%;
}

.map-overlay {
  position: absolute;
  z-index: 1000;
  padding: 0.6rem;
  border: 1px solid var(--border-color);
  background: var(--main-bg-color);
  width: 220px;
}

.map-options {
  top: 1rem;
  left: 1rem;
}

.map-legend {
  bottom: 1rem;
  left: 1rem;
}

.map-overlay-group:not(:last-child) {
  padding-bottom: 1.2rem;
}

.map-overlay-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.map-overlay-headline {
  padding-bottom: 0.3rem;
  font-size: 0.8rem;
  opacity: 0.8;
}

.map-options-buttons {
  display: grid;
}

/* .marker-switcher {
  background: var(--main-bg-color);
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border-color);
  font-size: 0.8rem;
  width: 160px;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
} */

.toggle {
  display: flex;
  gap: 0.6rem;
  justify-content: space-between;
}

.legend-row {
  display: flex;
  gap: 0.5rem;
  font-size: 0.8rem;
  align-items: center;
}

.legend-row:not(:last-child) {
  margin-bottom: 0.2rem;
}

.legend-marker {
  width: 0.8rem;
}

.legend-marker-default {
  color: var(--highlight-color);
}

.legend-marker-dungeon {
  color: var(--highlight-color-dark);
}

.expand-icon {
  color: var(--highlight-color);
  font-size: 0.65rem;
  transition: all 0.2s ease;
}

.collapsible__wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: all 200ms ease;
  padding-top: 0;
  opacity: 0;
}

.collapsible__wrapper.is-open {
  grid-template-rows: 1fr;
  opacity: 1;
  padding-top: 0.8rem;
}

.collapsible__inner {
  overflow: hidden;
  min-height: 0;
}
</style>

<style>
.marker {
  cursor: pointer;
}

.maplibregl-popup-content {
  background: var(--main-bg-color);
  border-radius: 0;
  padding: 0.4rem 1rem;
  font-family: 'Cinzel', serif;
  font-size: 0.7rem;
}

.maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
  border-top-color: var(--main-bg-color);
}

.maplibregl-popup-anchor-top .maplibregl-popup-tip {
  border-bottom-color: var(--main-bg-color);
}

.maplibregl-popup-anchor-left .maplibregl-popup-tip {
  border-right-color: var(--main-bg-color);
}

.maplibregl-popup-anchor-right .maplibregl-popup-tip {
  border-left-color: var(--main-bg-color);
}

.maplibregl-popup-close-button {
  outline: none;
}

.popup {
  z-index: 99;
}

.maplibregl-ctrl {
  margin: 1rem 1rem 0 0 !important;
}

.maplibregl-ctrl,
.maplibregl-ctrl-group button {
  border-color: var(--border-color) !important;
  border-radius: 0;
}

.maplibregl-ctrl-group {
  background-color: var(--main-bg-color) !important;
  border: 1px solid var(--border-color) !important;
  box-shadow: none !important;
}

.maplibregl-ctrl-group button span {
  filter: var(--color-filter);
}

.maplibregl-ctrl-group button:hover {
  background-color: var(--border-color) !important;
}
</style>
