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
  <div class="card" :class="{ defeated }">
    <div class="card-header">
      <img
        class="card-image"
        :class="{ 'spoiler-sensitive': !defeated }"
        :src="bossProfileImage"
        v-if="bossProfileImage"
      />
      <div class="boss-checkmark" v-if="defeated">&#x2714;</div>
    </div>
    <div class="card-body">
      <div class="card-title" :class="{ 'spoiler-sensitive': !defeated }">
        {{ boss.flagName }}
      </div>
      <div class="card-subtitle">
        {{ boss.location }}
      </div>
      <div class="boss-stats" v-if="showAttributes">
        <div>
          <div class="boss-stat-title" :title="$t('level')">{{ $t('level') }}</div>
          <div class="boss-stat-value">{{ formatNumber(boss.level ?? 0) }}</div>
        </div>
        <div>
          <div class="boss-stat-title" :title="$t('runes')">{{ $t('runes') }}</div>
          <div class="boss-stat-value">{{ formatNumber(boss.runes ?? 0) }}</div>
        </div>
        <div>
          <div class="boss-stat-title" :title="$t('hp')">{{ $t('hp') }}</div>
          <div class="boss-stat-value">{{ formatNumber(boss.hp ?? 0) }}</div>
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
  </div>
</template>

<style scoped>
.card {
  border: 1px solid var(--border-color);
  cursor: pointer;
  position: relative;
  transition: transform 0.2s ease;
  overflow: hidden;
}

.card-header {
  position: relative;
  aspect-ratio: 16 / 9;
}

.card.defeated {
  border-color: var(--highlight-color);
}

.card.defeated .card-title {
  color: var(--highlight-color);
}

.card:hover {
  background: var(--hover-background);
  /* transform: scale(1.03); */
  transform: translateY(-0.2rem) scale(1.02);
}

.card:hover .card-image {
  filter: sepia();
  /* filter: sepia() hue-rotate(300deg); */
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: filter 0.2s ease;
}

.card-body {
  padding: 0.6rem;
}

.card-subtitle {
  font-size: 0.7rem;
  opacity: 0.7;
}

.boss-stats {
  margin-top: 0.7rem;
  display: flex;
  gap: 0.8rem;
}

.boss-stat-title {
  font-size: 0.6rem;
  opacity: 0.7;
}

.boss-attributes {
  margin-top: 0.7rem;
  margin-bottom: 0;
}

.boss-checkmark {
  color: var(--highlight-color);
  position: absolute;
  right: 0.6rem;
  top: 0.6rem;
}
</style>
