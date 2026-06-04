<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSaveStore } from '@/stores/save'
import { storeToRefs } from 'pinia'
import { formatNumber } from '@/util'
import { encounters } from '@/model/encounters'
import { REGION_ORDER } from '@/model/regions'

const router = useRouter()
const saveStore = useSaveStore()
const { defeatedFlags } = storeToRefs(saveStore)

const searchQuery = ref('')
const filterGreatRune = ref(false)
const filterRemembrance = ref(false)
const filterNightOnly = ref(false)
const filterParryable = ref(false)
const filterTarnished = ref(false)
const defeatFilter = ref<'all' | 'defeated' | 'undefeated'>('all')
const expandedRegions = ref<Set<string>>(new Set(encounters.map((e) => e.region)))

function countDefeated(bosses: typeof encounters): number {
  return bosses.filter((b) => saveStore.defeatedFlags.has(b.flagId)).length
}

const baseGameBosses = encounters.filter((e) => !e.dlc)
const dlcBosses = encounters.filter((e) => e.dlc)

const defeatedBaseGame = computed(() => baseGameBosses.filter((e) => saveStore.defeatedFlags.has(e.flagId)).length)
const defeatedDlc = computed(() => dlcBosses.filter((e) => saveStore.defeatedFlags.has(e.flagId)).length)

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

    if (filterTarnished.value && !e.npcs.some((npc) => npc.tarnished)) {
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

function isRegionComplete(bosses: typeof encounters): boolean {
  return bosses.every((b) => saveStore.defeatedFlags.has(b.flagId))
}
</script>

<template>
  <div class="bordered-content boss-list">
    <div class="filters-container">
      <input type="text" class="search-input" :placeholder="$t('searchBosses')" v-model="searchQuery" />

      <div class="filter-row">
        <div class="filter-row-content">
          <div class="filter-group">
            <label class="filter-checkbox">
              <input type="checkbox" v-model="filterGreatRune" />
              <span class="check-box" :class="{ checked: filterGreatRune }"></span>
              <span class="filter-label">{{ $t('greatRune') }}</span>
            </label>

            <label class="filter-checkbox">
              <input type="checkbox" v-model="filterRemembrance" />
              <span class="check-box" :class="{ checked: filterRemembrance }"></span>
              <span class="filter-label">{{ $t('remembrance') }}</span>
            </label>

            <label class="filter-checkbox">
              <input type="checkbox" v-model="filterNightOnly" />
              <span class="check-box" :class="{ checked: filterNightOnly }"></span>
              <span class="filter-label">{{ $t('nightOnly') }}</span>
            </label>

            <label class="filter-checkbox">
              <input type="checkbox" v-model="filterParryable" />
              <span class="check-box" :class="{ checked: filterParryable }"></span>
              <span class="filter-label">{{ $t('parryableFilter') }}</span>
            </label>

            <label class="filter-checkbox">
              <input type="checkbox" v-model="filterTarnished" />
              <span class="check-box" :class="{ checked: filterTarnished }"></span>
              <span class="filter-label">{{ $t('tarnishedFilter') }}</span>
            </label>
          </div>

          <div class="filter-group">
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

        <div class="expand-all-group">
          <button class="expand-all-btn" @click="expandAll">{{ $t('expandAll') }}</button>
          <button class="expand-all-btn" @click="collapseAll">{{ $t('collapseAll') }}</button>
        </div>
      </div>
    </div>

    <div v-if="groupedBaseGameBosses.length === 0 && groupedDlcBosses.length === 0" class="no-results">{{ $t('noBossesMatch') }}</div>

    <template v-if="groupedBaseGameBosses.length">
      <div class="section-header">
        <span class="section-title">{{ $t('baseGameSection') }}</span>
        <span class="section-complete" v-if="defeatedBaseGame === baseGameBosses.length">✓</span>
        <span class="section-count">{{ defeatedBaseGame }}/{{ baseGameBosses.length }}</span>
      </div>

      <div v-for="[region, bosses] in groupedBaseGameBosses" :key="'bg-' + region" class="region-group" :class="{ completed: isRegionComplete(bosses) }">
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
            <span class="boss-name" :class="{ 'spoiler-sensitive': !defeatedFlags.has(boss.flagId) }">{{ boss.flagName }}</span>
            <span class="boss-location">{{ boss.location }}</span>
            <span class="boss-stat" :title="$t('runes')">
              {{ formatNumber(boss.runes) }}
            </span>
            <span class="boss-stat" :title="$t('hp')">
              {{ formatNumber(boss.hp) }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- <hr v-if="groupedBaseGameBosses.length && groupedDlcBosses.length" class="section-divider" /> -->

    <template v-if="groupedDlcBosses.length">
      <div class="section-header">
        <span class="section-title">{{ $t('dlcSection') }}</span>
        <span class="section-complete" v-if="defeatedDlc === dlcBosses.length">✓</span>
        <span class="section-count">{{ defeatedDlc }}/{{ dlcBosses.length }}</span>
      </div>

      <div v-for="[region, bosses] in groupedDlcBosses" :key="'dlc-' + region" class="region-group" :class="{ completed: isRegionComplete(bosses) }">
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
            <span class="boss-name" :class="{ 'spoiler-sensitive': !defeatedFlags.has(boss.flagId) }">{{ boss.flagName }}</span>
            <span class="boss-location">{{ boss.location }}</span>
            <span class="boss-stat" :title="$t('runes')">
              {{ formatNumber(boss.runes) }}
            </span>
            <span class="boss-stat" :title="$t('hp')">
              {{ formatNumber(boss.hp) }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.filter-row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.filter-row-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  font-size: 0.8rem;
  user-select: none;
}

.filter-checkbox input {
  display: none;
}

.check-box {
  width: 14px;
  height: 14px;
  border: 1px solid var(--border-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.check-box.checked {
  background: var(--highlight-color);
  border-color: var(--highlight-color);
}

.filter-label {
  opacity: 0.8;
}

.expand-all-group {
  display: flex;
  gap: 0.5rem;
}

.expand-all-btn {
  font-size: 0.65rem;
  padding: 0.2rem 0.45rem;
  background: var(--hover-background);
  color: var(--main-font-color);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: 0.2s;
}

.expand-all-btn:hover {
  border-color: var(--border-hover-color);
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
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.7;
  flex: 1;
}

.section-count {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--highlight-color);
  background: var(--hover-background);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  opacity: 0.7;
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
  background: linear-gradient(90deg, var(--highlight-color), transparent);
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
  transition: 0.2s;
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
  color: var(--highlight-color);
  flex: 1;
}

.region-count {
  font-size: 0.8rem;
  font-weight: bold;
  background: var(--hover-background);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  opacity: 0.7;
}

.region-group.completed .region-count {
  color: var(--highlight-color);
  opacity: 1;
}

.region-complete {
  color: var(--highlight-color);
  font-size: 0.85rem;
  font-weight: bold;
  flex-shrink: 0;
  width: 1rem;
  text-align: center;
}

.boss-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.5rem;
  font-size: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  border-bottom-color: rgba(89, 88, 84, 0.3);
  transition: background 0.15s;
  cursor: pointer;
}

.boss-row:hover {
  background: var(--hover-background);
}

.boss-row.defeated {
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
  font-weight: bold;
}

.boss-row:not(.defeated) .boss-name {
  opacity: 0.55;
}

.boss-location {
  opacity: 0.4;
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
  min-width: 2.5rem;
  text-align: right;
}


</style>
