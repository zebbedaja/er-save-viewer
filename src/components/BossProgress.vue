<script setup lang="ts">
import { computed } from 'vue'
import type { Slot } from '@zebbedaja/er-save-parser'
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
</script>

<template>
  <div class="boss-progress">
    <div class="boss-title">
      {{ $t('bossProgress') }}
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

.attributes-grid {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
</style>
