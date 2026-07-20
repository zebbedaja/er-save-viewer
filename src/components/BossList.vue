<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSaveStore } from '@/stores/save'
import { useEncounterStore } from '@/stores/encounter'
import { storeToRefs } from 'pinia'
import { formatNumber } from '@/util'
import type { ProcessedEncounter, Section } from '@/model/types'
import { REGION_ORDER } from '@/model/regions'
import ProgressBar from './ProgressBar.vue'

const router = useRouter()
const route = useRoute()
const saveStore = useSaveStore()
const encounterStore = useEncounterStore()
const { defeatedFlags } = storeToRefs(saveStore)

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

const filterGreatRune = createBoolFilterRef('filterGreatRune')
const filterRemembrance = createBoolFilterRef('filterRemembrance')
const filterGreatEnemy = createBoolFilterRef('filterGreatEnemy')
const filterLegend = createBoolFilterRef('filterLegend')
const filterDemigod = createBoolFilterRef('filterDemigod')
const filterGod = createBoolFilterRef('filterGod')
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

const groupingOn = computed({
  get: () => route.query.groupByRegion !== '0',
  set: (v: boolean) => {
    const q = { ...route.query }
    if (v) delete q.groupByRegion
    else q.groupByRegion = '0'
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
    if (filterGreatEnemy.value && e.type !== 'Great Enemy') return false
    if (filterLegend.value && e.type !== 'Legend') return false
    if (filterDemigod.value && e.type !== 'Demigod') return false
    if (filterGod.value && e.type !== 'God') return false
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
      labelKey: 'baseGameSection',
      keyPrefix: 'bg',
      bosses: groupedBaseGameBosses.value,
      defeated: defeatedBaseGame.value,
      total: filteredBaseGameCount.value,
      flatBosses: flatBaseGameBosses.value,
    },
    {
      id: 'dlc',
      labelKey: 'dlcSection',
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

const hasActiveFilters = computed(() => Object.keys(route.query).some((k) => k !== 'groupByRegion'))

function clearFilters() {
  const query = route.query.groupByRegion ? { groupByRegion: route.query.groupByRegion } : {}
  router.replace({ query })
  expandedRegions.value = new Set(encounterStore.encounters.map((e) => e.region))
}

function isRegionComplete(bosses: ProcessedEncounter[]): boolean {
  return bosses.every((b) => saveStore.defeatedFlags.has(b.flagId))
}
</script>

<template>
  <div class="bordered-content boss-list">
    <div class="filters-container">
      <div class="search-and-filter">
        <input type="text" class="search-input" :placeholder="$t('searchBosses')" v-model="searchQuery" />

        <div class="filter-group filter-group-connected">
          <button class="toggle-btn" :class="{ active: defeatFilter === 'all' }" @click="defeatFilter = 'all'">
            {{ $t('allBosses') }}
          </button>
          <button
            class="toggle-btn"
            :class="{ active: defeatFilter === 'defeated' }"
            @click="defeatFilter = 'defeated'"
          >
            {{ $t('defeatedOnly') }}
          </button>
          <button
            class="toggle-btn"
            :class="{ active: defeatFilter === 'undefeated' }"
            @click="defeatFilter = 'undefeated'"
          >
            {{ $t('undefeatedOnly') }}
          </button>
        </div>
      </div>

      <div class="filter-row">
        <div class="filter-row-content">
          <div class="filter-group">
            <button class="toggle-btn" :class="{ active: filterGreatRune }" @click="filterGreatRune = !filterGreatRune">
              {{ $t('greatRune') }}
            </button>

            <button
              class="toggle-btn"
              :class="{ active: filterRemembrance }"
              @click="filterRemembrance = !filterRemembrance"
            >
              {{ $t('remembrance') }}
            </button>

            <button
              class="toggle-btn"
              :class="{ active: filterGreatEnemy }"
              @click="filterGreatEnemy = !filterGreatEnemy"
            >
              {{ $t('greatEnemyFilter') }}
            </button>

            <button class="toggle-btn" :class="{ active: filterLegend }" @click="filterLegend = !filterLegend">
              {{ $t('legendFilter') }}
            </button>

            <button class="toggle-btn" :class="{ active: filterDemigod }" @click="filterDemigod = !filterDemigod">
              {{ $t('demigodFilter') }}
            </button>

            <button class="toggle-btn" :class="{ active: filterGod }" @click="filterGod = !filterGod">
              {{ $t('godFilter') }}
            </button>

            <button class="toggle-btn" :class="{ active: filterNightOnly }" @click="filterNightOnly = !filterNightOnly">
              {{ $t('nightOnly') }}
            </button>

            <button class="toggle-btn" :class="{ active: filterParryable }" @click="filterParryable = !filterParryable">
              {{ $t('parryableFilter') }}
            </button>

            <button class="toggle-btn" :class="{ active: filterHuman }" @click="filterHuman = !filterHuman">
              {{ $t('humanFilter') }}
            </button>

            <button class="toggle-btn" :class="{ active: filterDuoBoss }" @click="filterDuoBoss = !filterDuoBoss">
              {{ $t('duoBoss') }}
            </button>

            <button
              class="toggle-btn"
              :class="{ active: filterMultiPhase }"
              @click="filterMultiPhase = !filterMultiPhase"
            >
              {{ $t('multiPhaseBoss') }}
            </button>

            <button class="toggle-btn" :class="{ active: filterVoid }" @click="filterVoid = !filterVoid">
              {{ $t('voidFilter') }}
            </button>

            <button class="toggle-btn" :class="{ active: filterDragon }" @click="filterDragon = !filterDragon">
              {{ $t('dragonFilter') }}
            </button>

            <button
              class="toggle-btn"
              :class="{ active: filterAncientDragon }"
              @click="filterAncientDragon = !filterAncientDragon"
            >
              {{ $t('ancientDragonFilter') }}
            </button>

            <button class="toggle-btn" :class="{ active: filterUndead }" @click="filterUndead = !filterUndead">
              {{ $t('undeadFilter') }}
            </button>

            <button
              class="toggle-btn"
              :class="{ active: filterThoseWhoLiveInDeath }"
              @click="filterThoseWhoLiveInDeath = !filterThoseWhoLiveInDeath"
            >
              {{ $t('thoseWhoLiveInDeathFilter') }}
            </button>

            <button class="toggle-btn" :class="{ active: filterBackstab }" @click="filterBackstab = !filterBackstab">
              {{ $t('backstabFilter') }}
            </button>
          </div>
        </div>

        <div class="expand-all-group">
          <button class="toggle-btn" :class="{ active: groupingOn }" @click="groupingOn = !groupingOn">
            {{ $t('groupByRegion') }}
          </button>
          <template v-if="groupingOn">
            <a class="expand-all-link" href="#" @click.prevent="expandAll">{{ $t('expandAll') }}</a>
            <a class="expand-all-link" href="#" @click.prevent="collapseAll">{{ $t('collapseAll') }}</a>
          </template>
          <a class="expand-all-link" href="#" v-show="hasActiveFilters" @click.prevent="clearFilters">
            {{ $t('clearFilters') }}
          </a>
        </div>
      </div>
    </div>

    <div v-if="!sections.length" class="no-results">
      {{ $t('noBossesMatch') }}
    </div>

    <template v-for="(section, idx) in sections" :key="section.id">
      <hr v-if="idx > 0" class="section-divider" />

      <div class="section-header" :id="section.id">
        <span class="section-title">{{ $t(section.labelKey) }}</span>
        <ProgressBar
          class="region-progress"
          :percentage="(section.defeated / section.total) * 100"
          :flex="false"
        ></ProgressBar>
        <span class="section-complete" v-if="section.defeated === section.total">✓</span>
        <span class="section-count">{{ section.defeated }} / {{ section.total }}</span>
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

          <div v-show="expandedRegions.has(region)" class="boss-rows">
            <div
              v-for="boss in bosses"
              :key="boss.flagId"
              class="boss-row"
              :class="{ defeated: defeatedFlags.has(boss.flagId) }"
              @click="router.push({ name: 'boss-detail', params: { flagId: boss.flagId } })"
            >
              <span class="boss-check" v-if="defeatedFlags.has(boss.flagId)">&#x2714;</span>
              <span class="boss-check-placeholder" v-else></span>
              <div class="boss-row-info">
                <div class="boss-name" :class="{ 'spoiler-sensitive': !defeatedFlags.has(boss.flagId) }">
                  {{ boss.flagName }}
                </div>
                <div class="boss-location-stats">
                  <span class="boss-location">{{ boss.location }}</span>
                  <span> · </span>
                  <span class="boss-stat" :title="$t('level')">
                    <span class="stat-value">{{ $t('level') }} {{ formatNumber(boss.level ?? 0) }}</span>
                  </span>
                  <span> · </span>
                  <span class="boss-stat" :title="$t('runes')">
                    <span class="stat-value">{{ $t('runes') }}: {{ formatNumber(boss.runes) }}</span>
                  </span>
                  <span> · </span>
                  <span class="boss-stat" :title="$t('hp')">
                    <span class="stat-value">{{ $t('hp') }}: {{ formatNumber(boss.hp) }}</span>
                  </span>
                </div>
              </div>
              <div class="boss-attributes">
                <span class="attr-badge type">{{ boss.type }}</span>
                <span v-if="boss.nightOnly" class="attr-badge night">{{ $t('nightOnlyBadge') }}</span>
                <span v-if="boss.dlc" class="attr-badge dlc-tag">{{ $t('dlcBadge') }}</span>
                <span v-if="boss.hasGreatRune" class="attr-badge great-rune">{{ $t('greatRuneBadge') }}</span>
                <span v-if="boss.hasRemembrance" class="attr-badge remembrance">{{ $t('remembranceBadge') }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="boss-rows">
          <div
            v-for="boss in section.flatBosses"
            :key="boss.flagId"
            class="boss-row"
            :class="{ defeated: defeatedFlags.has(boss.flagId) }"
            @click="router.push({ name: 'boss-detail', params: { flagId: boss.flagId } })"
          >
            <span class="boss-check" v-if="defeatedFlags.has(boss.flagId)">&#x2714;</span>
            <span class="boss-check-placeholder" v-else></span>
            <div class="boss-row-info">
              <div class="boss-name" :class="{ 'spoiler-sensitive': !defeatedFlags.has(boss.flagId) }">
                {{ boss.flagName }}
              </div>
              <div class="boss-location-stats">
                <span class="boss-location">{{ boss.location }}</span>
                <span> · </span>
                <span class="boss-stat" :title="$t('level')">
                  <span class="stat-value">{{ $t('level') }} {{ formatNumber(boss.level ?? 0) }}</span>
                </span>
                <span> · </span>
                <span class="boss-stat" :title="$t('runes')">
                  <span class="stat-value">{{ $t('runes') }}: {{ formatNumber(boss.runes) }}</span>
                </span>
                <span> · </span>
                <span class="boss-stat" :title="$t('hp')">
                  <span class="stat-value">{{ $t('hp') }}: {{ formatNumber(boss.hp) }}</span>
                </span>
              </div>
            </div>
            <div class="boss-attributes">
              <span class="attr-badge type">{{ boss.type }}</span>
              <span v-if="boss.nightOnly" class="attr-badge night">{{ $t('nightOnlyBadge') }}</span>
              <span v-if="boss.dlc" class="attr-badge dlc-tag">{{ $t('dlcBadge') }}</span>
              <span v-if="boss.hasGreatRune" class="attr-badge great-rune">{{ $t('greatRuneBadge') }}</span>
              <span v-if="boss.hasRemembrance" class="attr-badge remembrance">{{ $t('remembranceBadge') }}</span>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.search-and-filter {
  display: flex;
  gap: 0.8rem;
  align-items: stretch;
}

.search-and-filter .search-input {
  flex: 1;
}

.search-and-filter .toggle-btn {
  display: flex;
  align-items: center;
}

.toggle-btn {
  background: transparent;
}

.toggle-btn.active,
.button.active {
  background: var(--highlight-color);
}

.filter-row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.filter-row .filter-group {
  flex-wrap: wrap;
}

.expand-all-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-color);
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
}

.section-title {
  font-size: 0.95rem;
  color: var(--highlight-color);
  letter-spacing: 0.1em;
  flex: 1;
}

.section-count {
  font-size: 0.8rem;
  width: 60px;
  text-align: end;
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
  /* background: linear-gradient(90deg, var(--highlight-color), transparent); */
  opacity: 0.3;
}

/* .region-group {
  border-bottom: 1px solid var(--border-color);
}

.region-group:last-child {
  border-bottom: none;
} */

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

.boss-row {
  display: grid;
  grid-template-columns: 1rem 1fr max-content;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.4rem;
  font-size: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.boss-row-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.boss-attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  margin: 0;
}

.boss-location-stats {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.4rem;
}

.boss-row:last-child {
  border-bottom: 0;
}

.boss-row:hover {
  background: var(--hover-background);
}

.boss-check {
  color: var(--highlight-color);
  font-weight: bold;
  font-size: 0.8rem;
  flex-shrink: 0;
  width: 1rem;
  text-align: center;
}

.boss-check-placeholder {
  flex-shrink: 0;
  width: 1rem;
}

.boss-name {
  font-size: 0.8rem;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.boss-row.defeated .boss-name {
  color: var(--highlight-color);
}

.boss-location {
  opacity: 0.6;
  font-size: 0.7rem;
  flex-shrink: 0;
  max-width: 10rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.boss-stat {
  font-size: 0.7rem;
  opacity: 0.7;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.2rem;
}

.region-progress {
  width: 100px;
}
</style>
