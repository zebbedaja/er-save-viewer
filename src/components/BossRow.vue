<script setup lang="ts">
import type { ProcessedEncounter } from '@/model/types'
import { formatNumber } from '@/util'

defineProps<{
  boss: ProcessedEncounter
  defeated: boolean
  showAttributes: boolean
  bossProfileImage?: string
}>()
</script>

<template>
  <div class="boss-row" :class="{ defeated }">
    <span class="boss-check" v-if="defeated">&#x2714;</span>
    <span class="boss-check-placeholder" v-else></span>
    <div class="boss-profile" :class="{ 'spoiler-sensitive': !defeated }" v-if="showAttributes">
      <img :src="bossProfileImage" v-if="bossProfileImage" />
    </div>
    <div class="boss-row-info">
      <div class="boss-name" :class="{ 'spoiler-sensitive': !defeated }">
        {{ boss.flagName }}
      </div>
      <div v-if="showAttributes" class="boss-location-stats">
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
    <div v-if="showAttributes" class="boss-attributes">
      <span v-if="boss.hasGreatRune" class="attr-badge great-rune">{{ $t('greatRune') }}</span>
      <span v-if="boss.hasRemembrance" class="attr-badge remembrance">{{ $t('remembrance') }}</span>
      <span class="attr-badge type">{{ $t(boss.type?.replaceAll(' ', '')?.toLocaleLowerCase()) }}</span>
      <span v-if="boss.nightOnly" class="attr-badge night">{{ $t('nightOnly') }}</span>
      <span v-if="boss.hasHuman" class="attr-badge positive">{{ $t('human') }}</span>
      <span v-if="boss.hasVoid" class="attr-badge void">{{ $t('void') }}</span>
      <span v-if="boss.hasDragon" class="attr-badge dragon">{{ $t('dragon') }}</span>
      <span v-if="boss.hasAncientDragon" class="attr-badge ancient-dragon">{{ $t('ancientDragon') }}</span>
      <span v-if="boss.hasThoseWhoLiveInDeath" class="attr-badge those-who-live-in-death">{{
        $t('thoseWhoLiveInDeath')
      }}</span>
      <span v-if="boss.hasUndead" class="attr-badge">{{ $t('undead') }}</span>
      <span v-if="boss.hasParryable" class="attr-badge">{{ $t('parryable') }}</span>
      <span v-if="boss.hasBackstab" class="attr-badge">{{ $t('backstabable') }}</span>
      <span v-if="boss.hasDuoPhase" class="attr-badge">{{ $t('duoBoss') }}</span>
      <span v-if="boss.hasMultiplePhases" class="attr-badge">{{ $t('multiPhaseBoss') }}</span>
    </div>
  </div>
</template>

<style scoped>
.boss-row {
  display: grid;
  /* grid-template-columns: 1rem 1fr max-content; */
  grid-template-columns: 1rem max-content 1fr max-content;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.4rem;
  font-size: 0.8rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  container-name: boss-row;
  container-type: inline-size;
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
  flex-wrap: wrap;
  gap: 0 0.4rem;
  font-size: 0.6rem;
  opacity: 0.6;
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

.boss-stat {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.2rem;
}

.boss-profile {
  width: 1.9rem;
  height: 1.9rem;
}

.boss-profile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid var(--border-color);
}

@container boss-row (width < 480px) {
  .boss-attributes {
    display: none;
  }
}
</style>
