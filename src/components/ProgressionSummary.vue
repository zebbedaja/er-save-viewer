<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Slot } from '@zebbedaja/er-save-parser'
import { useSaveStore } from '@/stores/save'
import { encounters } from '@/model/encounters'
import ProgressRow from './ProgressRow.vue'

const router = useRouter()
const saveStore = useSaveStore()

function openEventCategory(category: string) {
  router.push({ name: 'event-detail', params: { category } })
}

const props = defineProps<{
  saveSlot: Slot | null
}>()

const baseGameBosses = encounters.filter((e) => !e.dlc)
const dlcBosses = encounters.filter((e) => e.dlc)

const defeatedOverall = computed(() => encounters.filter((e) => saveStore.defeatedFlags.has(e.flagId)).length)
const defeatedBaseGame = computed(() => baseGameBosses.filter((e) => saveStore.defeatedFlags.has(e.flagId)).length)
const defeatedDlc = computed(() => dlcBosses.filter((e) => saveStore.defeatedFlags.has(e.flagId)).length)

const eventCategories: Record<string, string> = {
  story: 'eventsStory',
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

const eventProgress = computed(() => {
  if (!props.saveSlot) return []
  const flags = props.saveSlot.eventFlags || []
  const grouped: Record<string, { total: number; completed: number }> = {}
  for (const flag of flags) {
    const cat = flag.category || ''
    if (!(cat in eventCategories)) continue
    if (!grouped[cat]) {
      grouped[cat] = { total: 0, completed: 0 }
    }
    grouped[cat].total++
    if (flag.state) grouped[cat].completed++
  }
  return Object.entries(eventCategories)
    .map(([category, labelKey]) => ({
      category,
      label: labelKey,
      completed: grouped[category]?.completed ?? 0,
      total: grouped[category]?.total ?? 0,
    }))
    .filter((item) => item.total > 0)
    .map((item) => ({
      ...item,
      percentage: (item.completed / item.total) * 100,
    }))
})
</script>

<template>
  <div class="bordered-content">
    <div class="boss-title">
      {{ $t('bossProgress') }}
    </div>
    <div class="boss-subtitle">
      {{ $t('bosses') }}
    </div>
    <div class="attributes-grid">
      <ProgressRow
        :label="$t('overall')"
        :value="`${defeatedOverall}/${encounters.length}`"
        :percentage="(defeatedOverall / encounters.length) * 100"
      />
      <ProgressRow
        :label="$t('baseGame')"
        :value="`${defeatedBaseGame}/${baseGameBosses.length}`"
        :percentage="(defeatedBaseGame / baseGameBosses.length) * 100"
      />
      <ProgressRow
        :label="$t('dlc')"
        :value="`${defeatedDlc}/${dlcBosses.length}`"
        :percentage="(defeatedDlc / dlcBosses.length) * 100"
      />
    </div>
    <div class="events-section">
      <div class="events-title">
        {{ $t('events') }}
      </div>
      <div class="attributes-grid">
        <div
          v-for="item in eventProgress"
          :key="item.category"
          class="category-click"
          @click="openEventCategory(item.category)"
        >
          <ProgressRow
            :label="$t(item.label)"
            :value="`${item.completed}/${item.total}`"
            :percentage="item.percentage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bordered-content {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem 0.8rem;
  transition: 0.3s;
}

.boss-title {
  font-size: 1.4rem;
  color: var(--highlight-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.6rem;
}

.boss-subtitle {
  font-size: 1.2rem;
  color: var(--highlight-color);
  padding-bottom: 0.4rem;
}

.events-section {
  padding-top: 0.6rem;
  border-top: 1px solid var(--border-color);
  margin-top: 0.3rem;
}

.events-title {
  font-size: 1.2rem;
  color: var(--highlight-color);
  padding-bottom: 0.4rem;
}

.attributes-grid {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.category-click {
  cursor: pointer;
  transition: opacity 0.15s;
}

.category-click:hover {
  opacity: 0.75;
}
</style>
