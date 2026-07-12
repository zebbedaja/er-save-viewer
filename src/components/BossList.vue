<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSaveStore } from '@/stores/save'
import { storeToRefs } from 'pinia'
import { formatNumber } from '@/util'
import { encounters } from '@/model/encounters'
import type { Npc } from '@/model/types'
import { REGION_ORDER } from '@/model/regions'

const router = useRouter()
const route = useRoute()
const saveStore = useSaveStore()
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

const expandedRegions = ref<Set<string>>(new Set(encounters.map((e) => e.region)))

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

  return encounters.filter((e) => {
    if (query && !e.flagName.toLowerCase().includes(query)) {
      return false
    }

    if (filterGreatRune.value) {
      const has = e.drops.some((d) => /Great Rune/.test(d))
      if (!has) return false
    }

    if (filterRemembrance.value) {
      const has = e.drops.some((d) => /Remembrance/.test(d))
      if (!has) return false
    }

    if (filterNightOnly.value && !e.nightOnly) {
      return false
    }

    if (filterParryable.value && !e.npcs.some((npc) => npc.parryable)) {
      return false
    }

    if (filterHuman.value && !e.npcs.some((npc) => npc.human)) {
      return false
    }

    if (filterDuoBoss.value && !hasDuoPhase(e.npcs)) {
      return false
    }

    if (filterMultiPhase.value && !hasMultiplePhases(e.npcs)) {
      return false
    }

    if (filterVoid.value && !e.npcs.some((npc) => npc.void)) {
      return false
    }

    if (filterDragon.value && !e.npcs.some((npc) => npc.dragon)) {
      return false
    }

    if (filterAncientDragon.value && !e.npcs.some((npc) => npc.ancientDragon)) {
      return false
    }

    if (filterUndead.value && !e.npcs.some((npc) => npc.undead)) {
      return false
    }

    if (filterThoseWhoLiveInDeath.value && !e.npcs.some((npc) => npc.thoseWhoLiveInDeath)) {
      return false
    }

    if (filterBackstab.value && !e.npcs.some((npc) => npc.backstab)) {
      return false
    }

    const defeated = flags.has(e.flagId)

    if (defeatFilter.value === 'defeated' && !defeated) {
      return false
    }
    if (defeatFilter.value === 'undefeated' && defeated) {
      return false
    }

    return true
  })
})

function hasMultiplePhases(npcs: Npc[]): boolean {
  return npcs.length >= 2 && npcs.some((npc) => npc.phase >= 2)
}

function hasDuoPhase(npcs: Npc[]): boolean {
  const phaseCounts = new Map<number, number>()
  for (const npc of npcs) {
    phaseCounts.set(npc.phase, (phaseCounts.get(npc.phase) ?? 0) + 1)
  }
  return [...phaseCounts.values()].some((count) => count >= 2)
}

function countDefeated(bosses: typeof encounters): number {
  return bosses.filter((b) => saveStore.defeatedFlags.has(b.flagId)).length
}

function groupByRegion(list: typeof encounters) {
  const groups = new Map<string, typeof encounters>()

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

function toggleRegion(region: string) {
  if (expandedRegions.value.has(region)) {
    expandedRegions.value.delete(region)
  } else {
    expandedRegions.value.add(region)
  }
}

function expandAll() {
  expandedRegions.value = new Set([
    ...groupedBaseGameBosses.value.map(([region]) => region),
    ...groupedDlcBosses.value.map(([region]) => region),
  ])
}

function collapseAll() {
  expandedRegions.value = new Set()
}

const hasActiveFilters = computed(() => Object.keys(route.query).length > 0)

function clearFilters() {
  router.replace({ query: {} })
  expandedRegions.value = new Set(encounters.map((e) => e.region))
}

function isRegionComplete(bosses: typeof encounters): boolean {
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
          <a class="expand-all-link" href="#" @click.prevent="expandAll">{{ $t('expandAll') }}</a>
          <a class="expand-all-link" href="#" @click.prevent="collapseAll">{{ $t('collapseAll') }}</a>
          <a class="expand-all-link" href="#" v-show="hasActiveFilters" @click.prevent="clearFilters">
            {{ $t('clearFilters') }}
          </a>
        </div>
      </div>
    </div>

    <div v-if="groupedBaseGameBosses.length === 0 && groupedDlcBosses.length === 0" class="no-results">
      {{ $t('noBossesMatch') }}
    </div>

    <template v-if="groupedBaseGameBosses.length">
      <div class="section-header" id="base">
        <span class="section-title">{{ $t('baseGameSection') }}</span>
        <span class="section-complete" v-if="defeatedBaseGame === filteredBaseGameCount">✓</span>
        <span class="section-count">{{ defeatedBaseGame }} / {{ filteredBaseGameCount }}</span>
      </div>

      <div
        v-for="[region, bosses] in groupedBaseGameBosses"
        :key="'bg-' + region"
        class="region-group"
        :class="{ completed: isRegionComplete(bosses) }"
      >
        <div class="region-header" @click="toggleRegion(region)">
          <div class="expand-icon">{{ expandedRegions.has(region) ? '▼' : '▶' }}</div>
          <div class="region-name">{{ region }}</div>
          <div class="region-complete" v-if="isRegionComplete(bosses)">✓</div>
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
            <span class="boss-name" :class="{ 'spoiler-sensitive': !defeatedFlags.has(boss.flagId) }">{{
              boss.flagName
            }}</span>
            <span class="boss-location">{{ boss.location }}</span>
            <span class="boss-stat" :title="$t('runes')">
              <span class="stat-value">{{ formatNumber(boss.runes) }}</span>
              <span class="stat-icon">✦</span>
            </span>
            <span class="boss-stat" :title="$t('hp')">
              <span class="stat-value">{{ formatNumber(boss.hp) }}</span>
              <span class="stat-icon">♥</span>
            </span>
          </div>
        </div>
      </div>
    </template>

    <hr v-if="groupedBaseGameBosses.length && groupedDlcBosses.length" class="section-divider" />

    <template v-if="groupedDlcBosses.length">
      <div class="section-header" id="dlc">
        <span class="section-title">{{ $t('dlcSection') }}</span>
        <span class="section-complete" v-if="defeatedDlc === filteredDlcCount">✓</span>
        <span class="section-count">{{ defeatedDlc }}/{{ filteredDlcCount }}</span>
      </div>

      <div
        v-for="[region, bosses] in groupedDlcBosses"
        :key="'dlc-' + region"
        class="region-group"
        :class="{ completed: isRegionComplete(bosses) }"
      >
        <div class="region-header" @click="toggleRegion(region)">
          <span class="expand-icon">{{ expandedRegions.has(region) ? '▼' : '▶' }}</span>
          <span class="region-name">{{ region }}</span>
          <span class="region-complete" v-if="isRegionComplete(bosses)">✓</span>
          <span class="region-count">{{ countDefeated(bosses) }}/{{ bosses.length }}</span>
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
            <span class="boss-name" :class="{ 'spoiler-sensitive': !defeatedFlags.has(boss.flagId) }">{{
              boss.flagName
            }}</span>
            <span class="boss-location">{{ boss.location }}</span>
            <span class="boss-stat" :title="$t('runes')">
              <span class="stat-value">{{ formatNumber(boss.runes) }}</span>
              <span class="stat-icon">✦</span>
            </span>
            <span class="boss-stat" :title="$t('hp')">
              <span class="stat-value">{{ formatNumber(boss.hp) }}</span>
              <span class="stat-icon">♥</span>
            </span>
          </div>
        </div>
      </div>
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

.toggle-btn.active {
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
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-color);
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
  font-weight: bold;
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

.region-group {
  border-bottom: 1px solid var(--border-color);
}

.region-group:last-child {
  border-bottom: none;
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
  flex: 1;
}

.region-count {
  font-size: 0.8rem;
  font-weight: bold;
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
}

.boss-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0 0.4rem 0.4rem;
  font-size: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
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

.boss-row:not(.defeated) .boss-name {
  opacity: 0.7;
}

.boss-location {
  opacity: 0.7;
  font-size: 0.7rem;
  flex-shrink: 0;
  max-width: 10rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.boss-stat {
  font-size: 0.7rem;
  color: var(--highlight-color);
  opacity: 0.7;
  flex-shrink: 0;
  width: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.2rem;
}
</style>
