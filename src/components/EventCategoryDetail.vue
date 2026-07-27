<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Slot, EventFlag } from '@zebbedaja/er-save-parser'

const props = defineProps<{
  saveSlot: Slot | null
}>()

const route = useRoute()
const router = useRouter()

const category = computed(() => route.params.category as string)

const eventCategories: Record<string, string> = {
  story: 'eventsStory',
  keyItems: 'keyItems',
  greatRune: 'eventsGreatRune',
  worldEvent: 'eventsWorldEvent',
  multiplayer: 'eventsMultiplayer',
  cookbook: 'eventsCookbook',
  ashOfWar: 'eventsAshOfWar',
  revealMap: 'eventsAcquiredMap',
  memoryStone: 'eventsMemoryStone',
  crystalTear: 'eventsCrystalTear',
  affinity: 'eventsAffinity',
  talismanPouch: 'eventsTalismanPouch',
  ritualPot: 'eventsRitualPot',
  crackedPot: 'eventsCrackedPot',
  heftyCrackedPot: 'eventsHeftyCrackedPot',
  perfumeBottle: 'eventsPerfumeBottle',
  grace: 'eventsGrace',
  illusoryWall: 'eventsIllusoryWall',
}

const searchQuery = computed({
  get: () => (route.query.q as string) || '',
  set: (v: string) => {
    const q = { ...route.query }
    if (v) q.q = v
    else delete q.q
    router.replace({ query: q })
  },
})

const activationFilter = computed<'all' | 'activated' | 'notActivated'>({
  get: () =>
    ['all', 'activated', 'notActivated'].includes(route.query.activationFilter as string)
      ? (route.query.activationFilter as 'all' | 'activated' | 'notActivated')
      : 'all',
  set: (v: 'all' | 'activated' | 'notActivated') => {
    const q = { ...route.query }
    if (v !== 'all') q.activationFilter = v
    else delete q.activationFilter
    router.replace({ query: q })
  },
})

const categoryFlags = computed<EventFlag[]>(() => {
  if (!props.saveSlot?.eventFlags) return []
  const flags = props.saveSlot.eventFlags.filter((f) => f.category === category.value)
  const shouldSortByName = ['cookbook', 'ashOfWar', 'illusoryWall'].includes(category.value)
  return flags.toSorted(
    shouldSortByName
      ? (a, b) => (a.name || '').localeCompare(b.name || '', undefined, { numeric: true })
      : (a, b) => a.id - b.id,
  )
})

const filteredFlags = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return categoryFlags.value.filter((f) => {
    if (query && f.name?.toLowerCase().includes(query) === false && !String(f.id).includes(query)) {
      return false
    }

    if (activationFilter.value === 'activated' && !f.state) {
      return false
    }
    if (activationFilter.value === 'notActivated' && f.state) {
      return false
    }

    return true
  })
})

const activatedCount = computed(() => categoryFlags.value.filter((f) => f.state).length)

function goBack() {
  router.push({ name: 'boss-list' })
}
</script>

<template>
  <div class="bordered-content event-detail" v-if="category in eventCategories">
    <div class="event-detail-header">
      <button class="button button-sm" @click="goBack">{{ $t('backToBosses') }}</button>
      <div class="title-section">
        <h2 class="event-title">{{ $t(eventCategories[category] as unknown as keyof typeof $t) }}</h2>
        <span class="event-count">{{ activatedCount }} / {{ categoryFlags.length }}</span>
      </div>
    </div>

    <div class="filters-container">
      <div class="search-and-filter">
        <input type="text" class="search-input" :placeholder="$t('searchFlags')" v-model="searchQuery" />

        <div class="filter-group filter-group-connected">
          <button
            class="button toggle-button"
            :class="{ active: activationFilter === 'all' }"
            @click="activationFilter = 'all'"
          >
            {{ $t('allFlags') }}
          </button>
          <button
            class="button toggle-button"
            :class="{ active: activationFilter === 'activated' }"
            @click="activationFilter = 'activated'"
          >
            {{ $t('activatedOnly') }}
          </button>
          <button
            class="button toggle-button"
            :class="{ active: activationFilter === 'notActivated' }"
            @click="activationFilter = 'notActivated'"
          >
            {{ $t('notActivatedOnly') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredFlags.length === 0" class="no-results">{{ $t('noFlagsMatch') }}</div>

    <div class="flag-list">
      <div class="flag-header">
        <span class="header-check"></span>
        <span class="header-name">{{ $t('flagName') }}</span>
        <span class="header-location">{{ $t('flagLocation') }}</span>
      </div>

      <div v-for="flag in filteredFlags" :key="flag.id" class="flag-row" :class="{ activated: flag.state }">
        <span class="flag-check" v-if="flag.state">&#x2714;</span>
        <span class="flag-check-placeholder" v-else></span>
        <span class="flag-name" :class="{ 'spoiler-sensitive': !flag.state }">{{ flag.name || '—' }}</span>
        <span class="flag-location">{{ flag.location || '—' }}</span>
      </div>
    </div>
  </div>

  <div class="event-detail" v-else>
    <div class="event-detail-header">
      <button class="back-btn" @click="goBack">{{ $t('backToBosses') }}</button>
    </div>
    <div class="not-found">{{ $t('bossNotFound') }}</div>
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

.search-and-filter .toggle-button {
  display: flex;
  align-items: center;
}

.event-detail-header {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 0.8rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid var(--border-color);
}

.event-detail-header .button {
  align-self: start;
}

.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.event-title {
  font-size: 1.1rem;
  color: var(--highlight-color);
  margin: 0;
  letter-spacing: 0.05em;
}

.event-count {
  font-size: 0.8rem;
  color: var(--highlight-color);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

.not-found {
  text-align: center;
  padding: 2rem;
  opacity: 0.5;
  font-style: italic;
}

.flag-list {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.flag-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.5rem;
  font-size: 0.65rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
  border-bottom: 1px solid var(--border-color);
  user-select: none;
}

.header-check {
  flex-shrink: 0;
  width: 1rem;
  text-align: center;
}

.header-name {
  flex: 1;
  min-width: 0;
}

.header-location {
  flex-shrink: 0;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flag-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.5rem;
  font-size: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  border-bottom-color: rgba(89, 88, 84, 0.3);
  transition: background-color 0.15s;
}

.flag-row:hover {
  background: var(--hover-background);
}

.flag-check {
  color: var(--highlight-color);
  font-weight: bold;
  font-size: 0.8rem;
  flex-shrink: 0;
  width: 1rem;
  text-align: center;
}

.flag-check-placeholder {
  flex-shrink: 0;
  width: 1rem;
}

.flag-name {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flag-row.activated .flag-name {
  color: var(--highlight-color);
}

.flag-row:not(.activated) .flag-name {
  opacity: 0.55;
}

.flag-location {
  opacity: 0.4;
  font-size: 0.8rem;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
}
</style>
