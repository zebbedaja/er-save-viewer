<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSaveStore } from '@/stores/save'
import { useEncounterStore } from '@/stores/encounter'
import { storeToRefs } from 'pinia'
import { DungeonType, type ProcessedEncounter, type Section } from '@/model/types'
import { REGION_ORDER } from '@/model/regions'
import ProgressBar from './ProgressBar.vue'
import BossRow from './BossRow.vue'
import BossCard from './BossCard.vue'
import { useRouteQuery } from '@vueuse/router'

const router = useRouter()
const route = useRoute()
const saveStore = useSaveStore()
const encounterStore = useEncounterStore()
const { defeatedFlags } = storeToRefs(saveStore)
const searchRef = ref<HTMLInputElement | null>(null)

const filterGreatRune = createBoolFilterRef('filterGreatRune')
const filterRemembrance = createBoolFilterRef('filterRemembrance')
const filterNightOnly = createBoolFilterRef('filterNightOnly')
const filterParryable = createBoolFilterRef('filterParryable')
const filterHuman = createBoolFilterRef('filterHuman')
const filterDuoBoss = createBoolFilterRef('filterDuoBoss')
const filterMultiPhase = createBoolFilterRef('filterMultiPhase')
const filterVoid = createBoolFilterRef('filterVoid')
const filterDragon = createBoolFilterRef('filterDragon')
const filterAncientDragon = createBoolFilterRef('filterAncientDragon')
const filterUndead = createBoolFilterRef('filterUndead')
const filterThoseWhoLiveInDeath = createBoolFilterRef('filterThoseWhoLiveInDeath')
const filterBackstab = createBoolFilterRef('filterBackstab')

const filterBossTypeValues = [
  {
    name: 'enemy',
    search: 'Enemy',
  },
  {
    name: 'greatEnemy',
    search: 'Great Enemy',
  },
  {
    name: 'legend',
    search: 'Legend',
  },
  {
    name: 'demigod',
    search: 'Demigod',
  },
  {
    name: 'god',
    search: 'God',
  },
]
const filterBossType = useRouteQuery<string | null>('filterBossType', null)

const filterDungeonTypeValues = [
  {
    type: DungeonType.CATACOMBS,
    name: 'catacombs',
    search: ['Catacombs', 'Auriza Side', 'Hidden Path'],
  },
  {
    type: DungeonType.TUNNEL,
    name: 'tunnel',
    search: ['Tunnel'],
  },
  {
    type: DungeonType.CAVE,
    name: 'cave',
    search: ['Cave', 'Grotto', "Dragon's Pit", 'Sellia Hideaway'],
  },
  {
    type: DungeonType.GAOL,
    name: 'gaol',
    search: [' Gaol'],
  },
  {
    type: DungeonType.EVERGAOL,
    name: 'evergaol',
    search: ['Evergaol'],
  },
  {
    type: DungeonType.HEROS_GRAVE,
    name: 'herosGrave',
    search: ["Hero's Grave"],
  },
  {
    type: DungeonType.RUINS,
    name: 'ruins',
    search: ['Ruins'],
  },
  {
    type: DungeonType.MAUSOLEUM,
    name: 'mausoleum',
    search: ['Mausoleum'],
  },
]
const filterDungeonType = useRouteQuery<DungeonType | null>('filterDungeonType', null)

const bossProfileImages = import.meta.glob<{ default: string }>('../assets/img/bosses-sm/*', { eager: true })
const bossProfileImagesMap = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {}
  for (const [path, url] of Object.entries(bossProfileImages)) {
    const id =
      path
        .split('/')
        .pop()
        ?.replace(/\.\w+$/, '') ?? ''
    map[id] = url.default
  }
  return map
})

const searchQuery = computed({
  get: () => (route.query.q as string) || '',
  set: (v: string) => {
    const q = { ...route.query }
    if (v) q.q = v
    else delete q.q
    router.replace({ query: q })
  },
})

function createBoolFilterRef(key: string) {
  return computed({
    get: () => route.query[key] === '1',
    set: (v: boolean) => {
      const q = { ...route.query }
      if (v) q[key] = '1'
      else delete q[key]
      router.replace({ query: q })
    },
  })
}

const groupingOn = computed({
  get: () => route.query.groupByRegion !== '0',
  set: (v: boolean) => {
    const q = { ...route.query }
    if (v) delete q.groupByRegion
    else q.groupByRegion = '0'
    router.replace({ query: q })
  },
})

const showAttributes = computed({
  get: () => route.query.showAttributes !== '0',
  set: (v: boolean) => {
    const q = { ...route.query }
    if (v) delete q.showAttributes
    else q.showAttributes = '0'
    router.replace({ query: q })
  },
})

const showGallery = computed({
  get: () => route.query.showGallery !== '0',
  set: (v: boolean) => {
    const q = { ...route.query }
    if (v) delete q.showGallery
    else q.showGallery = '0'
    router.replace({ query: q })
  },
})

const defeatFilter = computed<'all' | 'defeated' | 'undefeated'>({
  get: () =>
    ['all', 'defeated', 'undefeated'].includes(route.query.defeatFilter as string)
      ? (route.query.defeatFilter as 'all' | 'defeated' | 'undefeated')
      : 'all',
  set: (v: 'all' | 'defeated' | 'undefeated') => {
    const q = { ...route.query }
    if (v !== 'all') q.defeatFilter = v
    else delete q.defeatFilter
    router.replace({ query: q })
  },
})

const expandedRegions = ref<Set<string>>(new Set(encounterStore.encounters.map((e) => e.region)))

const filteredBaseGameCount = computed(() => filteredEncounters.value.filter((e) => !e.dlc).length)
const filteredDlcCount = computed(() => filteredEncounters.value.filter((e) => e.dlc).length)

const defeatedBaseGame = computed(
  () => filteredEncounters.value.filter((e) => !e.dlc && saveStore.defeatedFlags.has(e.flagId)).length,
)
const defeatedDlc = computed(
  () => filteredEncounters.value.filter((e) => e.dlc && saveStore.defeatedFlags.has(e.flagId)).length,
)

const filteredEncounters = computed(() => {
  const query = searchQuery.value.toLowerCase()
  const flags = saveStore.defeatedFlags

  return encounterStore.encounters.filter((e) => {
    if (query && !e.flagName.toLowerCase().includes(query)) {
      return false
    }

    if (filterGreatRune.value && !e.hasGreatRune) return false
    if (filterRemembrance.value && !e.hasRemembrance) return false
    // if (filterBossType.value === 'enemy' && e.type !== 'Enemy') return false
    // if (filterBossType.value === 'greatEnemy' && e.type !== 'Great Enemy') return false
    // if (filterBossType.value === 'legend' && e.type !== 'Legend') return false
    // if (filterBossType.value === 'demigod' && e.type !== 'Demigod') return false
    // if (filterBossType.value === 'god' && e.type !== 'God') return false
    if (filterNightOnly.value && !e.nightOnly) return false
    if (filterParryable.value && !e.hasParryable) return false
    if (filterHuman.value && !e.hasHuman) return false
    if (filterDuoBoss.value && !e.hasDuoPhase) return false
    if (filterMultiPhase.value && !e.hasMultiplePhases) return false
    if (filterVoid.value && !e.hasVoid) return false
    if (filterDragon.value && !e.hasDragon) return false
    if (filterAncientDragon.value && !e.hasAncientDragon) return false
    if (filterUndead.value && !e.hasUndead) return false
    if (filterThoseWhoLiveInDeath.value && !e.hasThoseWhoLiveInDeath) return false
    if (filterBackstab.value && !e.hasBackstab) return false

    for (const bossType of filterBossTypeValues) {
      if (filterBossType.value === bossType.name && bossType.search !== e.type) return false
    }

    for (const dungeonType of filterDungeonTypeValues) {
      if (filterDungeonType.value === dungeonType.type && !dungeonType.search.find((s) => e.location.includes(s)))
        return false
    }

    const defeated = flags.has(e.flagId)

    if (defeatFilter.value === 'defeated' && !defeated) return false
    if (defeatFilter.value === 'undefeated' && defeated) return false

    return true
  })
})

function countDefeated(bosses: ProcessedEncounter[]): number {
  return bosses.filter((b) => saveStore.defeatedFlags.has(b.flagId)).length
}

function groupByRegion(list: ProcessedEncounter[]) {
  const groups = new Map<string, ProcessedEncounter[]>()

  for (const e of list) {
    const regionList = groups.get(e.region)
    if (regionList) {
      regionList.push(e)
    } else {
      groups.set(e.region, [e])
    }
  }

  return [...groups.entries()].sort((a, b) => {
    const iA = REGION_ORDER.indexOf(a[0])
    const iB = REGION_ORDER.indexOf(b[0])
    const oA = iA === -1 ? REGION_ORDER.length : iA
    const oB = iB === -1 ? REGION_ORDER.length : iB
    return oA - oB
  })
}

const groupedBaseGameBosses = computed(() => groupByRegion(filteredEncounters.value.filter((e) => !e.dlc)))
const groupedDlcBosses = computed(() => groupByRegion(filteredEncounters.value.filter((e) => e.dlc)))

const flatBaseGameBosses = computed(() => groupedBaseGameBosses.value.flatMap(([, bosses]) => bosses))
const flatDlcBosses = computed(() => groupedDlcBosses.value.flatMap(([, bosses]) => bosses))

const sections = computed<Section[]>(() =>
  [
    {
      id: 'base',
      labelKey: 'baseGame',
      keyPrefix: 'bg',
      bosses: groupedBaseGameBosses.value,
      defeated: defeatedBaseGame.value,
      total: filteredBaseGameCount.value,
      flatBosses: flatBaseGameBosses.value,
    },
    {
      id: 'dlc',
      labelKey: 'dlc',
      keyPrefix: 'dlc',
      bosses: groupedDlcBosses.value,
      defeated: defeatedDlc.value,
      total: filteredDlcCount.value,
      flatBosses: flatDlcBosses.value,
    },
  ].filter((s) => s.bosses.length > 0),
)

function toggleRegion(region: string) {
  if (expandedRegions.value.has(region)) {
    expandedRegions.value.delete(region)
  } else {
    expandedRegions.value.add(region)
  }
}

function expandAll() {
  expandedRegions.value = new Set(sections.value.flatMap((s) => s.bosses.map(([region]) => region)))
}

function collapseAll() {
  expandedRegions.value = new Set()
}

const hasActiveFilters = computed(() =>
  Object.keys(route.query).some((k) => k !== 'groupByRegion' && k !== 'showAttributes' && k !== 'gallery'),
)

function clearFilters() {
  const query: Record<string, string> = {}
  if (route.query.groupByRegion === '0') query.groupByRegion = '0'
  if (route.query.showAttributes === '0') query.showAttributes = '0'
  if (route.query.gallery === '1') query.gallery = '1'
  router.replace({ query })
  expandedRegions.value = new Set(encounterStore.encounters.map((e) => e.region))
}

function isRegionComplete(bosses: ProcessedEncounter[]): boolean {
  return bosses.every((b) => saveStore.defeatedFlags.has(b.flagId))
}

function onSearch() {
  searchRef.value?.blur()
}

function setFilterDungeonType(type: DungeonType) {
  filterDungeonType.value = filterDungeonType.value === type ? null : type
}

function setFilterBossType(name: string) {
  filterBossType.value = filterBossType.value === name ? null : name
}
</script>

<template>
  <div class="bordered-content boss-list">
    <div class="filters-container">
      <div class="search-and-filter">
        <input
          type="search"
          class="search-input"
          :placeholder="$t('searchBosses')"
          v-model="searchQuery"
          ref="searchRef"
          enterkeyhint="search"
          @keydown.enter.prevent="onSearch"
        />

        <div class="filter-group filter-group-connected">
          <button
            class="button toggle-button"
            :class="{ active: defeatFilter === 'all' }"
            @click="defeatFilter = 'all'"
          >
            {{ $t('all') }}
          </button>
          <button
            class="button toggle-button"
            :class="{ active: defeatFilter === 'defeated' }"
            @click="defeatFilter = 'defeated'"
          >
            {{ $t('defeatedOnly') }}
          </button>
          <button
            class="button toggle-button"
            :class="{ active: defeatFilter === 'undefeated' }"
            @click="defeatFilter = 'undefeated'"
          >
            {{ $t('undefeatedOnly') }}
          </button>
        </div>
      </div>

      <div class="filter-group">
        <button
          class="button toggle-button"
          :class="{ active: filterGreatRune }"
          @click="filterGreatRune = !filterGreatRune"
        >
          {{ $t('greatRune') }}
        </button>

        <button
          class="button toggle-button"
          :class="{ active: filterRemembrance }"
          @click="filterRemembrance = !filterRemembrance"
        >
          {{ $t('remembrance') }}
        </button>

        <!-- <div class="filter-group filter-group-connected"> -->
        <button
          v-for="bossType of filterBossTypeValues"
          :key="bossType.name"
          class="button toggle-button"
          :class="{ active: filterBossType === bossType.name }"
          @click="setFilterBossType(bossType.name)"
        >
          {{ $t(bossType.name) }}
        </button>
        <!-- </div> -->

        <button
          class="button toggle-button"
          :class="{ active: filterNightOnly }"
          @click="filterNightOnly = !filterNightOnly"
        >
          {{ $t('nightOnly') }}
        </button>

        <button class="button toggle-button" :class="{ active: filterHuman }" @click="filterHuman = !filterHuman">
          {{ $t('human') }}
        </button>

        <button class="button toggle-button" :class="{ active: filterVoid }" @click="filterVoid = !filterVoid">
          {{ $t('void') }}
        </button>

        <button class="button toggle-button" :class="{ active: filterDragon }" @click="filterDragon = !filterDragon">
          {{ $t('dragon') }}
        </button>

        <button
          class="button toggle-button"
          :class="{ active: filterAncientDragon }"
          @click="filterAncientDragon = !filterAncientDragon"
        >
          {{ $t('ancientDragon') }}
        </button>

        <button
          class="button toggle-button"
          :class="{ active: filterThoseWhoLiveInDeath }"
          @click="filterThoseWhoLiveInDeath = !filterThoseWhoLiveInDeath"
        >
          {{ $t('thoseWhoLiveInDeath') }}
        </button>

        <button class="button toggle-button" :class="{ active: filterUndead }" @click="filterUndead = !filterUndead">
          {{ $t('undead') }}
        </button>

        <button
          class="button toggle-button"
          :class="{ active: filterParryable }"
          @click="filterParryable = !filterParryable"
        >
          {{ $t('parryable') }}
        </button>

        <button
          class="button toggle-button"
          :class="{ active: filterBackstab }"
          @click="filterBackstab = !filterBackstab"
        >
          {{ $t('backstabable') }}
        </button>

        <button class="button toggle-button" :class="{ active: filterDuoBoss }" @click="filterDuoBoss = !filterDuoBoss">
          {{ $t('duoBoss') }}
        </button>

        <button
          class="button toggle-button"
          :class="{ active: filterMultiPhase }"
          @click="filterMultiPhase = !filterMultiPhase"
        >
          {{ $t('multiPhaseBoss') }}
        </button>

        <!-- <div class="filter-group filter-group-connected"> -->
        <button
          v-for="dungeonType of filterDungeonTypeValues"
          :key="dungeonType.type"
          class="button toggle-button"
          :class="{ active: filterDungeonType === dungeonType.type }"
          @click="setFilterDungeonType(dungeonType.type)"
        >
          {{ $t(dungeonType.name) }}
        </button>
        <!-- </div> -->
      </div>

      <div class="expand-all-group">
        <div class="toggle-buttons-group">
          <button class="button toggle-button" :class="{ active: groupingOn }" @click="groupingOn = !groupingOn">
            {{ $t('groupByRegion') }}
          </button>
          <button
            class="button toggle-button"
            :class="{ active: showAttributes }"
            @click="showAttributes = !showAttributes"
          >
            {{ $t('showBossAttributes') }}
          </button>
          <button class="button toggle-button" :class="{ active: showGallery }" @click="showGallery = !showGallery">
            {{ $t('gallery') }}
          </button>
        </div>
        <div class="actions-group">
          <a class="expand-all-link" href="#" v-show="hasActiveFilters" @click.prevent="clearFilters">
            {{ $t('clearFilters') }}
          </a>
          <template v-if="groupingOn">
            <a class="expand-all-link" href="#" @click.prevent="expandAll">{{ $t('expandAll') }}</a>
            <a class="expand-all-link" href="#" @click.prevent="collapseAll">{{ $t('collapseAll') }}</a>
          </template>
        </div>
      </div>
    </div>

    <div v-if="!sections.length" class="no-results">
      {{ $t('noBossesMatch') }}
    </div>

    <template v-for="(section, idx) in sections" :key="section.id">
      <hr v-if="idx > 0" class="section-divider" />

      <div class="section-header" :id="section.id">
        <span class="section-title heading-2">{{ $t(section.labelKey) }}</span>
        <ProgressBar
          class="region-progress"
          :percentage="(section.defeated / section.total) * 100"
          :flex="false"
        ></ProgressBar>
        <span class="section-complete" v-if="section.defeated === section.total">✓</span>
        <div class="boss-check-placeholder" v-else></div>
        <span class="section-count" :class="{ completed: section.defeated === section.total }"
          >{{ section.defeated }} / {{ section.total }}</span
        >
      </div>

      <template v-if="groupingOn">
        <div
          v-for="[region, bosses] in section.bosses"
          :key="section.keyPrefix + '-' + region"
          class="region-group"
          :class="{ completed: isRegionComplete(bosses) }"
        >
          <div class="region-header" @click="toggleRegion(region)">
            <div class="expand-icon">{{ expandedRegions.has(region) ? '▼' : '▶' }}</div>
            <div class="region-name">{{ region }}</div>
            <ProgressBar
              class="region-progress"
              :percentage="(countDefeated(bosses) / bosses.length) * 100"
              :flex="false"
            ></ProgressBar>
            <div class="region-complete" v-if="isRegionComplete(bosses)">✓</div>
            <div class="boss-check-placeholder" v-else></div>
            <div class="region-count">{{ countDefeated(bosses) }} / {{ bosses.length }}</div>
          </div>

          <div v-show="expandedRegions.has(region)" class="boss-rows" v-if="!showGallery">
            <BossRow
              v-for="boss in bosses"
              :key="boss.flagId"
              :boss="boss"
              :boss-profile-image="bossProfileImagesMap[boss.flagId]"
              :show-attributes="showAttributes"
              :defeated="defeatedFlags.has(boss.flagId)"
              @click="router.push({ name: 'boss-detail', params: { flagId: boss.flagId } })"
            />
          </div>
          <div v-show="expandedRegions.has(region)" class="boss-cards" v-else>
            <BossCard
              v-for="boss in bosses"
              :key="boss.flagId"
              :boss="boss"
              :boss-profile-image="bossProfileImagesMap[boss.flagId]"
              :show-attributes="showAttributes"
              :defeated="defeatedFlags.has(boss.flagId)"
              @click="router.push({ name: 'boss-detail', params: { flagId: boss.flagId } })"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="boss-rows" v-if="!showGallery">
          <BossRow
            v-for="boss in section.flatBosses"
            :key="boss.flagId"
            :boss="boss"
            :boss-profile-image="bossProfileImagesMap[boss.flagId]"
            :show-attributes="showAttributes"
            :defeated="defeatedFlags.has(boss.flagId)"
            @click="router.push({ name: 'boss-detail', params: { flagId: boss.flagId } })"
          />
        </div>
        <div class="boss-cards" v-else>
          <BossCard
            v-for="boss in section.flatBosses"
            :key="boss.flagId"
            :boss="boss"
            :boss-profile-image="bossProfileImagesMap[boss.flagId]"
            :show-attributes="showAttributes"
            :defeated="defeatedFlags.has(boss.flagId)"
            @click="router.push({ name: 'boss-detail', params: { flagId: boss.flagId } })"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.expand-all-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.6rem;
  padding-top: 0.6rem;
  border-top: 1px solid var(--border-color);
}

.toggle-buttons-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.actions-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.expand-all-link {
  font-size: 0.65rem;
  color: var(--main-font-color);
  text-decoration: none;
  cursor: pointer;
  transition: 0.2s;
}

.expand-all-link:hover {
  color: var(--link-color);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 0 0.3rem;
  user-select: none;
  gap: 0.4rem;
}

.section-title {
  flex: 1;
}

.section-count {
  font-size: 0.8rem;
  width: 60px;
  text-align: end;
}

.section-count.completed {
  color: var(--highlight-color);
}

.section-complete {
  color: var(--highlight-color);
  font-size: 0.85rem;
  font-weight: bold;
  margin-right: 0.3rem;
}

.section-divider {
  height: 2px;
  margin: 0.4rem 0;
  border: none;
  opacity: 0.3;
}

.region-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}

.region-header:hover {
  opacity: 0.85;
}

.expand-icon {
  font-size: 0.6rem;
  color: var(--highlight-color);
  flex-shrink: 0;
  width: 1rem;
  text-align: center;
}

.region-name {
  font-size: 0.85rem;
  width: 240px;
  flex: 1;
}

.region-count {
  font-size: 0.8rem;
  width: 60px;
  text-align: end;
}

.region-group.completed .region-count {
  color: var(--highlight-color);
}

.region-complete {
  color: var(--highlight-color);
  font-size: 0.85rem;
  font-weight: bold;
  flex-shrink: 0;
  width: 1rem;
  text-align: center;
}

.boss-rows {
  margin-left: 1.3rem;
  margin-bottom: 1.3rem;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.boss-cards {
  display: grid;
  gap: 0.7rem;
  margin-bottom: 1.3rem;
  margin-left: 1.3rem;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.boss-check-placeholder {
  flex-shrink: 0;
  width: 1rem;
}

.region-progress {
  width: 100px;
}
</style>
