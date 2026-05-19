<script setup lang="ts">
import { computed } from 'vue'
import type { Character, Slot } from '@zebbedaja/er-save-parser'

import { useSaveStore } from '@/stores/save'

import erWretchMale from '@/assets/img/er-wretch-male.png'
import erWretchFemale from '@/assets/img/er-wretch-female.png'

const saveStore = useSaveStore()
const { resetActiveSlot, resetSaveFile } = saveStore

const props = defineProps<{
  saveSlot: Slot
}>()

const character = computed<Character | undefined>(() => props.saveSlot?.character)
</script>

<template>
  <div class="character-overview">
    <div class="profile-header">
      <div class="profile-image">
        <img :src="erWretchFemale" v-if="character?.bodyType === 0" />
        <img :src="erWretchMale" v-else />
      </div>
      <div class="char-name">
        {{ character?.characterName }}
      </div>
    </div>

    <div class="level-row">
      <div class="mini-stat">
        <span class="mini-label">{{ $t('level') }}</span>
        <span class="mini-value">{{ character?.level ?? 0 }}</span>
      </div>
      <div class="mini-stat">
        <span class="mini-label">{{ $t('runes') }}</span>
        <span class="mini-value">{{ character?.runesMemory ?? 0 }}</span>
      </div>
    </div>

    <div class="vitals-row">
      <div class="mini-stat">
        <span class="mini-label">{{ $t('maxHp') }}</span>
        <span class="mini-value">{{ character?.maxHp ?? 0 }}</span>
      </div>
      <div class="mini-stat">
        <span class="mini-label">{{ $t('maxFp') }}</span>
        <span class="mini-value">{{ character?.maxFp ?? 0 }}</span>
      </div>
      <div class="mini-stat">
        <span class="mini-label">{{ $t('maxSp') }}</span>
        <span class="mini-value">{{ character?.maxSp ?? 0 }}</span>
      </div>
      <div class="mini-stat">
        <span class="mini-label">{{ $t('totalDeaths') }}</span>
        <span class="mini-value">{{ props.saveSlot.totalDeathCount ?? 0 }}</span>
      </div>
    </div>

    <div class="flask-row">
      <div class="mini-stat">
        <span class="mini-label">{{ $t('crimsonTears') }}</span>
        <span class="mini-value">{{ character?.maxCrimsonTearFlaskCount ?? 0 }}</span>
      </div>
      <div class="mini-stat">
        <span class="mini-label">{{ $t('ceruleanTears') }}</span>
        <span class="mini-value">{{ character?.maxCeruleanTearFlaskCount ?? 0 }}</span>
      </div>
      <div class="mini-stat">
        <span class="mini-label">{{ $t('talismanSlots') }}</span>
        <span class="mini-value">{{
          character?.additionalTalismanSlotCount ? character?.additionalTalismanSlotCount + 1 : 0
        }}</span>
      </div>
    </div>

    <div class="attributes-grid">
      <div class="attr-row">
        <span class="attr-label">{{ $t('vigor') }}</span>
        <span class="attr-value">{{ character?.vigor ?? 0 }}</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: `${Math.min(((character?.vigor ?? 0) / 99) * 100, 100)}%` }"></div>
        </div>
      </div>
      <div class="attr-row">
        <span class="attr-label">{{ $t('mind') }}</span>
        <span class="attr-value">{{ character?.mind ?? 0 }}</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: `${Math.min(((character?.mind ?? 0) / 99) * 100, 100)}%` }"></div>
        </div>
      </div>
      <div class="attr-row">
        <span class="attr-label">{{ $t('endurance') }}</span>
        <span class="attr-value">{{ character?.endurance ?? 0 }}</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: `${Math.min(((character?.endurance ?? 0) / 99) * 100, 100)}%` }"></div>
        </div>
      </div>
      <div class="attr-row">
        <span class="attr-label">{{ $t('strength') }}</span>
        <span class="attr-value">{{ character?.strength ?? 0 }}</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: `${Math.min(((character?.strength ?? 0) / 99) * 100, 100)}%` }"></div>
        </div>
      </div>
      <div class="attr-row">
        <span class="attr-label">{{ $t('dexterity') }}</span>
        <span class="attr-value">{{ character?.dexterity ?? 0 }}</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: `${Math.min(((character?.dexterity ?? 0) / 99) * 100, 100)}%` }"></div>
        </div>
      </div>
      <div class="attr-row">
        <span class="attr-label">{{ $t('faith') }}</span>
        <span class="attr-value">{{ character?.faith ?? 0 }}</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: `${Math.min(((character?.faith ?? 0) / 99) * 100, 100)}%` }"></div>
        </div>
      </div>
      <div class="attr-row">
        <span class="attr-label">{{ $t('intelligence') }}</span>
        <span class="attr-value">{{ character?.intelligence ?? 0 }}</span>
        <div class="bar-track">
          <div
            class="bar-fill"
            :style="{ width: `${Math.min(((character?.intelligence ?? 0) / 99) * 100, 100)}%` }"
          ></div>
        </div>
      </div>
      <div class="attr-row">
        <span class="attr-label">{{ $t('arcane') }}</span>
        <span class="attr-value">{{ character?.arcane ?? 0 }}</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: `${Math.min(((character?.arcane ?? 0) / 99) * 100, 100)}%` }"></div>
        </div>
      </div>
    </div>
    <div class="button-row">
      <button class="button" @click="resetActiveSlot">{{ $t('selectDifferentCharacter') }}</button>
      <button class="button" @click="resetSaveFile">{{ $t('selectDifferentSave') }}</button>
    </div>
  </div>
</template>

<style scoped>
.character-overview {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  color: var(--main-font-color);
  padding: 0.8rem;
  border: 1px solid var(--border-color);
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

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.char-name {
  font-family: 'Cinzel', serif;
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
  font-family: 'Cinzel', serif;
  opacity: 0.7;
}

.mini-value {
  font-family: 'Cinzel', serif;
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

.attr-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.15rem 0;
}

.attr-label {
  font-family: 'Cinzel', serif;
  font-size: 0.7rem;
  text-transform: uppercase;
  width: 5.5rem;
  flex-shrink: 0;
  opacity: 0.7;
}

.attr-value {
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  color: var(--highlight-color);
  font-weight: bold;
  width: 1.5rem;
  text-align: right;
  flex-shrink: 0;
}

.bar-track {
  flex: 1;
  height: 3px;
  background: var(--border-color);
  border-radius: 1.5px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--highlight-color);
  border-radius: 1.5px;
  transition: width 0.4s ease;
}

.button-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
}
</style>
