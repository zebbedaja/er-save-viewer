<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Slot } from '@zebbedaja/er-save-parser'
import { encounters } from '@/model/encounters'

const router = useRouter()

const props = defineProps<{
  saveSlot: Slot | null
}>()

const searchQuery = ref('')
const filterGreatRune = ref(false)
const filterRemembrance = ref(false)
const defeatFilter = ref<'all' | 'defeated' | 'undefeated'>('all')
const expandedRegions = ref<Set<string>>(new Set(encounters.map((e) => e.region)))

function isDefeated(flagId: number): boolean {
  return (
    props.saveSlot?.eventFlags?.some((f) => f.id === flagId && f.state) ?? false
  )
}

function countDefeated(bosses: typeof encounters): number {
  return bosses.filter((b) => isDefeated(b.flagId)).length
}

const baseGameBosses = encounters.filter((e) => !e.dlc)
const dlcBosses = encounters.filter((e) => e.dlc)

const defeatedOverall = computed(() =>
  encounters.filter((e) => isDefeated(e.flagId)).length
)
const defeatedBaseGame = computed(() =>
  baseGameBosses.filter((e) => isDefeated(e.flagId)).length
)
const defeatedDlc = computed(() =>
  dlcBosses.filter((e) => isDefeated(e.flagId)).length
)

const filteredEncounters = computed(() => {
  const query = searchQuery.value.toLowerCase()

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

    const defeated = isDefeated(e.flagId)

    if (defeatFilter.value === 'defeated' && !defeated) {
      return false
    }
    if (defeatFilter.value === 'undefeated' && defeated) {
      return false
    }

    return true
  })
})

const groupedBosses = computed(() => {
  const groups = new Map<string, typeof encounters>()

  for (const e of filteredEncounters.value) {
    const list = groups.get(e.region)
    if (list) {
      list.push(e)
    } else {
      groups.set(e.region, [e])
    }
  }

  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))
})

function toggleRegion(region: string) {
  if (expandedRegions.value.has(region)) {
    expandedRegions.value.delete(region)
  } else {
    expandedRegions.value.add(region)
  }
}

function expandAll() {
  expandedRegions.value = new Set(groupedBosses.value.map(([region]) => region))
}

function collapseAll() {
  expandedRegions.value = new Set()
}

function formatNumber(n: number | undefined): string {
  if (n === undefined) return '—'
  return n.toLocaleString()
}
</script>

<template>
  <div class="boss-list">
    <div class="boss-list-header">
      <h2 class="boss-title">{{ $t('bosses') }}</h2>
    </div>

    <div class="progression-container">
      <div class="progression-item">
        <div class="progression-header">
          <span class="progression-label">{{ $t('overallProgress') }}</span>
          <span class="progression-count">{{ defeatedOverall }}/{{ encounters.length }}</span>
        </div>
        <div class="progression-bar">
          <div class="progression-fill" :style="{ width: (defeatedOverall / encounters.length) * 100 + '%' }"></div>
        </div>
      </div>

      <div class="progression-item">
        <div class="progression-header">
          <span class="progression-label">{{ $t('baseGameProgress') }}</span>
          <span class="progression-count">{{ defeatedBaseGame }}/{{ baseGameBosses.length }}</span>
        </div>
        <div class="progression-bar">
          <div class="progression-fill base-game" :style="{ width: (defeatedBaseGame / baseGameBosses.length) * 100 + '%' }"></div>
        </div>
      </div>

      <div class="progression-item">
        <div class="progression-header">
          <span class="progression-label">{{ $t('dlcProgress') }}</span>
          <span class="progression-count">{{ defeatedDlc }}/{{ dlcBosses.length }}</span>
        </div>
        <div class="progression-bar">
          <div class="progression-fill dlc" :style="{ width: (defeatedDlc / dlcBosses.length) * 100 + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="filters">
      <div class="search-group">
        <input
          type="text"
          class="search-input"
          :placeholder="$t('searchBosses')"
          v-model="searchQuery"
        />
      </div>

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
          </div>

          <div class="filter-group">
            <button
              class="defeat-toggle-btn"
              :class="{ active: defeatFilter === 'all' }"
              @click="defeatFilter = 'all'"
            >
              {{ $t('allBosses') }}
            </button>
            <button
              class="defeat-toggle-btn"
              :class="{ active: defeatFilter === 'defeated' }"
              @click="defeatFilter = 'defeated'"
            >
              {{ $t('defeatedOnly') }}
            </button>
            <button
              class="defeat-toggle-btn"
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

    <div v-if="groupedBosses.length === 0" class="no-results">
      No bosses match your filters.
    </div>

    <div
      v-for="[region, bosses] in groupedBosses"
      :key="region"
      class="region-group"
    >
      <div
        class="region-header"
        @click="toggleRegion(region)"
      >
        <span class="expand-icon">{{ expandedRegions.has(region) ? '▼' : '▶' }}</span>
        <span class="region-name">{{ region }}</span>
        <span class="region-count">{{ countDefeated(bosses) }}/{{ bosses.length }}</span>
      </div>

      <div v-show="expandedRegions.has(region)" class="boss-rows">
        <div
          v-for="boss in bosses"
          :key="boss.flagId"
          class="boss-row"
          :class="{ defeated: isDefeated(boss.flagId) }"
          @click="router.push({ name: 'boss-detail', params: { flagId: boss.flagId } })"
        >
          <span class="boss-check" v-if="isDefeated(boss.flagId)">&#x2714;</span>
          <span class="boss-name">{{ boss.flagName }}</span>
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
  </div>
</template>

<style scoped>
.boss-list {
  color: var(--main-font-color);
  padding: 1rem 0.8rem;
  border: 1px solid var(--border-color);
  overflow-y: auto;
}

.boss-title {
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  color: var(--highlight-color);
  margin: 0 0 0.8rem;
  text-align: center;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid var(--border-color);
}

.search-input {
  width: 100%;
  padding: 0.4rem 0.6rem;
  font-family: 'CrimsonText', sans-serif;
  font-size: 0.9rem;
  background: var(--hover-background);
  color: var(--main-font-color);
  border: 1px solid var(--border-color);
  outline: none;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: var(--highlight-color);
}

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

.filter-group {
  display: flex;
  gap: 0.5rem;
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
  font-family: 'Cinzel', serif;
  opacity: 0.8;
}

.defeat-toggle-btn {
  font-family: 'Cinzel', serif;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  background: var(--hover-background);
  color: var(--main-font-color);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: 0.2s;
}

.defeat-toggle-btn:hover {
  border-color: var(--border-hover-color);
}

.defeat-toggle-btn.active {
  background: var(--highlight-color);
  color: var(--main-bg-color);
  border-color: var(--highlight-color);
}

.expand-all-group {
  display: flex;
  gap: 0.5rem;
}

.expand-all-btn {
  font-family: 'Cinzel', serif;
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

.no-results {
  text-align: center;
  padding: 1.5rem;
  opacity: 0.5;
  font-style: italic;
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
  font-family: 'Cinzel', serif;
  font-size: 0.85rem;
  color: var(--highlight-color);
  flex: 1;
}

.region-count {
  font-family: 'Cinzel', serif;
  font-size: 0.7rem;
  opacity: 0.5;
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
  font-family: 'Cinzel', serif;
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
  font-family: 'Cinzel', serif;
  font-size: 0.7rem;
  color: var(--highlight-color);
  opacity: 0.7;
  flex-shrink: 0;
  min-width: 2.5rem;
  text-align: right;
}

.progression-container {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 0.5rem;
}

.progression-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.progression-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progression-label {
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  color: var(--highlight-color);
  opacity: 0.85;
}

.progression-count {
  font-family: 'Cinzel', serif;
  font-size: 0.7rem;
  color: var(--highlight-color);
  opacity: 0.7;
}

.progression-bar {
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.progression-fill {
  height: 100%;
  background: var(--highlight-color);
  border-radius: 3px;
  transition: width 0.4s ease;
}

.progression-fill.base-game {
  opacity: 0.85;
}

.progression-fill.dlc {
  opacity: 0.65;
}
</style>
