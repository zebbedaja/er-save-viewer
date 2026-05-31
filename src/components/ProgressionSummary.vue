<script setup lang="ts">
import { computed } from 'vue'
import type { EventFlag, Slot } from '@zebbedaja/er-save-parser'
import { encounters } from '@/model/encounters'
import { isBossDefeated } from '@/util/index'
import ProgressRow from './ProgressRow.vue'

const props = defineProps<{
  saveSlot: Slot | null
}>()

const baseGameBosses = encounters.filter((e) => !e.dlc)
const dlcBosses = encounters.filter((e) => e.dlc)

const defeatedOverall = computed(() => encounters.filter((e) => isBossDefeated(props.saveSlot, e.flagId)).length)
const defeatedBaseGame = computed(() => baseGameBosses.filter((e) => isBossDefeated(props.saveSlot, e.flagId)).length)
const defeatedDlc = computed(() => dlcBosses.filter((e) => isBossDefeated(props.saveSlot, e.flagId)).length)

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
}

const eventProgress = computed(() => {
  if (!props.saveSlot) return []
  const flags = props.saveSlot.eventFlags as EventFlag[]
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
  <div class="boss-progress">
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
        <ProgressRow
          v-for="item in eventProgress"
          :key="item.category"
          :label="$t(item.label)"
          :value="`${item.completed}/${item.total}`"
          :percentage="item.percentage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.boss-progress {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  color: var(--main-font-color);
  padding: 0.8rem;
  border: 1px solid var(--border-color);
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
</style>
