<script setup lang="ts">
import { computed } from 'vue'
import type { Character, Slot } from '@zebbedaja/er-save-parser'

import { useSaveStore } from '@/stores/save'
import { formatNumber } from '@/util'
import ProgressRow from '@/components/ProgressRow.vue'
import CharacterImage from '@/components/CharacterImage.vue'

const saveStore = useSaveStore()
const { resetActiveSlot, resetSaveFile } = saveStore

const props = defineProps<{
  saveSlot: Slot
}>()

const character = computed<Character | undefined>(() => props.saveSlot?.character)
</script>

<template>
  <div class="bordered-content">
    <div class="profile-header">
      <div class="profile-image">
        <CharacterImage :char="{ archetype: character?.archetype, bodyType: character?.bodyType }" />
      </div>
      <div class="char-name">
        {{ character?.characterName }}
      </div>
    </div>

    <div class="level-row">
      <div class="mini-stat">
        <span class="mini-label">{{ $t('level') }}</span>
        <span class="mini-value">{{ formatNumber(character?.level ?? 0) }}</span>
      </div>
      <div class="mini-stat">
        <span class="mini-label">{{ $t('runes') }}</span>
        <span class="mini-value">{{ formatNumber(character?.runesMemory ?? 0) }}</span>
      </div>
    </div>

    <div class="vitals-row">
      <div class="mini-stat">
        <span class="mini-label">{{ $t('maxHp') }}</span>
        <span class="mini-value">{{ formatNumber(character?.maxHp ?? 0) }}</span>
      </div>
      <div class="mini-stat">
        <span class="mini-label">{{ $t('maxFp') }}</span>
        <span class="mini-value">{{ formatNumber(character?.maxFp ?? 0) }}</span>
      </div>
      <div class="mini-stat">
        <span class="mini-label">{{ $t('maxSp') }}</span>
        <span class="mini-value">{{ formatNumber(character?.maxSp ?? 0) }}</span>
      </div>
      <div class="mini-stat">
        <span class="mini-label">{{ $t('totalDeaths') }}</span>
        <span class="mini-value">{{ formatNumber(props.saveSlot.totalDeathCount ?? 0) }}</span>
      </div>
    </div>

    <div class="flask-row">
      <div class="mini-stat">
        <span class="mini-label">{{ $t('crimsonTears') }}</span>
        <span class="mini-value">{{ formatNumber(character?.maxCrimsonTearFlaskCount ?? 0) }}</span>
      </div>
      <div class="mini-stat">
        <span class="mini-label">{{ $t('ceruleanTears') }}</span>
        <span class="mini-value">{{ formatNumber(character?.maxCeruleanTearFlaskCount ?? 0) }}</span>
      </div>
      <div class="mini-stat">
        <span class="mini-label">{{ $t('talismanSlots') }}</span>
        <span class="mini-value">{{
          formatNumber(character?.additionalTalismanSlotCount ? character?.additionalTalismanSlotCount + 1 : 0)
        }}</span>
      </div>
    </div>

    <div class="attributes-grid">
      <ProgressRow
        :label="$t('vigor')"
        :value="formatNumber(character?.vigor ?? 0)"
        :percentage="Math.min(((character?.vigor ?? 0) / 99) * 100, 100)"
      />
      <ProgressRow
        :label="$t('mind')"
        :value="formatNumber(character?.mind ?? 0)"
        :percentage="Math.min(((character?.mind ?? 0) / 99) * 100, 100)"
      />
      <ProgressRow
        :label="$t('endurance')"
        :value="formatNumber(character?.endurance ?? 0)"
        :percentage="Math.min(((character?.endurance ?? 0) / 99) * 100, 100)"
      />
      <ProgressRow
        :label="$t('strength')"
        :value="formatNumber(character?.strength ?? 0)"
        :percentage="Math.min(((character?.strength ?? 0) / 99) * 100, 100)"
      />
      <ProgressRow
        :label="$t('dexterity')"
        :value="formatNumber(character?.dexterity ?? 0)"
        :percentage="Math.min(((character?.dexterity ?? 0) / 99) * 100, 100)"
      />
      <ProgressRow
        :label="$t('intelligence')"
        :value="formatNumber(character?.intelligence ?? 0)"
        :percentage="Math.min(((character?.intelligence ?? 0) / 99) * 100, 100)"
      />
      <ProgressRow
        :label="$t('faith')"
        :value="formatNumber(character?.faith ?? 0)"
        :percentage="Math.min(((character?.faith ?? 0) / 99) * 100, 100)"
      />
      <ProgressRow
        :label="$t('arcane')"
        :value="formatNumber(character?.arcane ?? 0)"
        :percentage="Math.min(((character?.arcane ?? 0) / 99) * 100, 100)"
      />
    </div>
    <div class="button-row">
      <button class="button" @click="resetActiveSlot">{{ $t('selectDifferentCharacter') }}</button>
      <button class="button" @click="resetSaveFile">{{ $t('selectDifferentSave') }}</button>
    </div>
  </div>
</template>

<style scoped>
.bordered-content {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.8rem;
  transition: 0.3s;
}

.profile-header {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.6rem;
  /* justify-content: space-between; */
  gap: 0.8rem;
  align-items: center;
}

.profile-image {
  width: 3rem;
  height: 3rem;
  border: 1px solid var(--border-color);
}

.char-name {
  font-size: 1.4rem;
  color: var(--highlight-color);
}

.level-row,
.vitals-row,
.flask-row {
  display: grid;
  gap: 0.4rem;
}

.level-row {
  grid-template-columns: repeat(2, 1fr);
}

.vitals-row {
  grid-template-columns: repeat(2, 1fr);
}

.flask-row {
  grid-template-columns: repeat(3, 1fr);
}

.mini-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0.4rem;
  font-size: 0.75rem;
  background: var(--hover-background);
}

.mini-label {
  opacity: 0.7;
}

.mini-value {
  color: var(--highlight-color);
  font-weight: bold;
}

.attributes-grid {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--border-color);
}

.button-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
}
</style>
