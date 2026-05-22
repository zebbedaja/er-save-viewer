<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Slot } from '@zebbedaja/er-save-parser'
import { encounters } from '@/model/encounters'

const props = defineProps<{
  saveSlot: Slot | null
}>()

const route = useRoute()
const router = useRouter()

const flagId = computed(() => Number(route.params.flagId))
const boss = computed(() => encounters.find((e) => e.flagId === flagId.value))

function isDefeated(): boolean {
  return props.saveSlot?.eventFlags?.some((f) => f.id === flagId.value && f.state) ?? false
}

function formatNumber(n: number): string {
  return n.toLocaleString()
}

function goBack() {
  router.push({ name: 'boss-list' })
}

function getNegationClass(value: number): string {
  if (value > 20) return 'resistant'
  if (value < 10) return 'vulnerable'
  return 'neutral'
}

function getResistanceClass(value: number | 'Immune'): string {
  if (value === 'Immune') return 'immune'
  if (value > 600) return 'resistant'
  if (value < 400) return 'vulnerable'
  return 'neutral'
}
</script>

<template>
  <div class="boss-detail" v-if="boss">
    <div class="boss-detail-header">
      <button class="back-btn" @click="goBack">{{ $t('backToBosses') }}</button>
      <div class="boss-title-row">
        <span class="boss-icon" v-if="isDefeated()">&#x2714;</span>
        <h2 class="boss-name">{{ boss.flagName }}</h2>
      </div>

      <div class="boss-attributes">
        <span class="attr-badge type">
          {{ boss.type }}
        </span>
        <span v-if="boss.nightOnly" class="attr-badge night">
          {{ $t('nightOnlyBadge') }}
        </span>
        <span v-if="boss.dlc" class="attr-badge dlc-tag">
          {{ $t('dlcBadge') }}
        </span>
        <span v-if="boss.drops.some((d) => /Great Rune/.test(d))" class="attr-badge great-rune">
          {{ $t('greatRuneBadge') }}
        </span>
        <span v-if="boss.drops.some((d) => /Remembrance/.test(d))" class="attr-badge remembrance">
          {{ $t('remembranceBadge') }}
        </span>
      </div>
    </div>

    <div class="boss-meta">
      <div class="meta-row">
        <span class="meta-label">{{ $t('location') }}</span>
        <span class="meta-value">{{ boss.location }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">{{ $t('region') }}</span>
        <span class="meta-value">{{ boss.region }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">{{ $t('closestGrace') }}</span>
        <span class="meta-value">{{ boss.closestSiteOfGrace }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">{{ $t('hp') }}</span>
        <span class="meta-value meta-highlight">{{ formatNumber(boss.hp) }}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">{{ $t('runes') }}</span>
        <span class="meta-value meta-highlight">{{ formatNumber(boss.runes) }}</span>
      </div>
      <div class="meta-row" v-if="boss.drops.length">
        <span class="meta-label">{{ $t('drops') }}</span>
        <span class="meta-value drops-list">
          <span class="drop-item" v-for="(drop, i) in boss.drops" :key="i">{{ drop }}</span>
        </span>
      </div>
    </div>

    <div class="npc-phase" v-for="(npc, index) in boss.npcs" :key="index">
      <h3 class="phase-title">
        {{ $t('phase') }} {{ npc.phase }}
        <span class="npc-name">{{ npc.name }}</span>
      </h3>

      <div class="npc-attributes">
        <span class="attr-badge" :class="npc.vulnerableToCriticalHit ? 'positive' : 'negative'">
          {{ npc.vulnerableToCriticalHit ? $t('vulnerableToCriticalHit') : $t('notVulnerableToCriticalHit') }}
        </span>
        <span class="attr-badge" :class="npc.parryable ? 'positive' : 'negative'">
          {{ npc.parryable ? $t('parryable') + ' x' + npc.numberOfParries : $t('notParryable') }}
        </span>
        <span class="attr-badge" :class="npc.backstab ? 'positive' : 'negative'">
          {{ npc.backstab ? $t('backstab') : $t('noBackstab') }}
        </span>
        <span class="attr-badge" :class="npc.tarnished ? 'positive' : 'negative'">
          {{ npc.tarnished ? $t('tarnished') : $t('notTarnished') }}
        </span>
      </div>

      <div class="npc-stats-tall">
        <div class="meta-row">
          <span class="meta-label">{{ $t('hp') }}</span>
          <span class="meta-value meta-highlight">{{ formatNumber(npc.hp) }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">{{ $t('npcDefense') }}</span>
          <span class="meta-value meta-highlight">{{ formatNumber(npc.defense) }}</span>
        </div>
        <div class="meta-row" v-if="npc.weakPart">
          <span class="meta-label">{{ $t('weakPart') }}</span>
          <span class="meta-value meta-highlight">
            {{ npc.weakPart }} (x{{ npc.weakPartMultiplier }})
          </span>
        </div>
      </div>

      <div class="phase-data">
        <div class="data-section">
          <h4 class="section-title">{{ $t('negation') }}</h4>
          <div class="negation-grid">
            <div class="data-cell" :class="getNegationClass(npc.negation.standard)">
              <span class="data-label">{{ $t('standard') }}</span>
              <span class="data-value">{{ npc.negation.standard }}%</span>
            </div>
            <div class="data-cell" :class="getNegationClass(npc.negation.strike)">
              <span class="data-label">{{ $t('strike') }}</span>
              <span class="data-value">{{ npc.negation.strike }}%</span>
            </div>
            <div class="data-cell" :class="getNegationClass(npc.negation.slash)">
              <span class="data-label">{{ $t('slash') }}</span>
              <span class="data-value">{{ npc.negation.slash }}%</span>
            </div>
            <div class="data-cell" :class="getNegationClass(npc.negation.pierce)">
              <span class="data-label">{{ $t('pierce') }}</span>
              <span class="data-value">{{ npc.negation.pierce }}%</span>
            </div>
            <div class="data-cell" :class="getNegationClass(npc.negation.magic)">
              <span class="data-label">{{ $t('magic') }}</span>
              <span class="data-value">{{ npc.negation.magic }}%</span>
            </div>
            <div class="data-cell" :class="getNegationClass(npc.negation.fire)">
              <span class="data-label">{{ $t('fire') }}</span>
              <span class="data-value">{{ npc.negation.fire }}%</span>
            </div>
            <div class="data-cell" :class="getNegationClass(npc.negation.lightning)">
              <span class="data-label">{{ $t('lightning') }}</span>
              <span class="data-value">{{ npc.negation.lightning }}%</span>
            </div>
            <div class="data-cell" :class="getNegationClass(npc.negation.holy)">
              <span class="data-label">{{ $t('holy') }}</span>
              <span class="data-value">{{ npc.negation.holy }}%</span>
            </div>
          </div>
        </div>

        <div class="data-section">
          <h4 class="section-title">{{ $t('resistance') }}</h4>
          <div class="negation-grid">
            <div class="data-cell" :class="getResistanceClass(npc.resistance.poison)">
              <span class="data-label">{{ $t('poison') }}</span>
              <span class="data-value">{{
                npc.resistance.poison === 'Immune' ? $t('immune') : npc.resistance.poison
              }}</span>
            </div>
            <div class="data-cell" :class="getResistanceClass(npc.resistance.rot)">
              <span class="data-label">{{ $t('rot') }}</span>
              <span class="data-value">{{ npc.resistance.rot === 'Immune' ? $t('immune') : npc.resistance.rot }}</span>
            </div>
            <div class="data-cell" :class="getResistanceClass(npc.resistance.bleed)">
              <span class="data-label">{{ $t('bleed') }}</span>
              <span class="data-value">{{
                npc.resistance.bleed === 'Immune' ? $t('immune') : npc.resistance.bleed
              }}</span>
            </div>
            <div class="data-cell" :class="getResistanceClass(npc.resistance.frost)">
              <span class="data-label">{{ $t('frost') }}</span>
              <span class="data-value">{{
                npc.resistance.frost === 'Immune' ? $t('immune') : npc.resistance.frost
              }}</span>
            </div>
            <div class="data-cell" :class="getResistanceClass(npc.resistance.madness)">
              <span class="data-label">{{ $t('madness') }}</span>
              <span class="data-value">{{
                npc.resistance.madness === 'Immune' ? $t('immune') : npc.resistance.madness
              }}</span>
            </div>
            <div class="data-cell" :class="getResistanceClass(npc.resistance.sleep)">
              <span class="data-label">{{ $t('sleep') }}</span>
              <span class="data-value">{{
                npc.resistance.sleep === 'Immune' ? $t('immune') : npc.resistance.sleep
              }}</span>
            </div>
            <div class="data-cell" :class="getResistanceClass(npc.resistance.deathblight)">
              <span class="data-label">{{ $t('deathblight') }}</span>
              <span class="data-value">{{
                npc.resistance.deathblight === 'Immune' ? $t('immune') : npc.resistance.deathblight
              }}</span>
            </div>
          </div>
        </div>

        <div class="data-section">
          <h4 class="section-title">{{ $t('stance') }}</h4>
          <div class="negation-grid stance-grid">
            <div class="data-cell">
              <span class="data-label">{{ $t('base') }}</span>
              <span class="data-value">{{ npc.stance.base }}</span>
            </div>
            <div class="data-cell">
              <span class="data-label">{{ $t('multiplier') }}</span>
              <span class="data-value">x{{ npc.stance.mult }}</span>
            </div>
            <div class="data-cell">
              <span class="data-label">{{ $t('effective') }}</span>
              <span class="data-value">{{ npc.stance.effective }}</span>
            </div>
            <div class="data-cell">
              <span class="data-label">{{ $t('regenDelay') }}</span>
              <span class="data-value">{{ npc.stance.regenerationDelay }}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="boss-videos" v-if="boss.youtube != null && boss.youtube.length > 0">
      <h3 class="boss-videos-title">Boss Kills</h3>
      <div class="youtube-wrapper" v-for="(url, index) in boss.youtube" :key="index">
        <!-- https://img.youtube.com/vi/E3KTrz9aiqg/maxresdefault.jpg -->
        <iframe
          :src="`https://www.youtube-nocookie.com/embed/${url?.split('=')[1]}`"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>

  <div class="boss-not-found" v-else>
    <button class="back-btn" @click="goBack">{{ $t('backToBosses') }}</button>
    <p>Boss not found</p>
  </div>
</template>

<style scoped>
.boss-detail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.boss-detail-header {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid var(--border-color);
}

.back-btn {
  align-self: flex-start;
  background: none;
  border: 1px solid var(--border-color);
  color: var(--main-font-color);
  font-size: 0.7rem;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  border-color: var(--highlight-color);
  color: var(--highlight-color);
}

.boss-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.boss-icon {
  color: var(--highlight-color);
  font-weight: bold;
  font-size: 1rem;
}

.boss-name {
  font-size: 1.1rem;
  color: var(--highlight-color);
  margin: 0;
}

.boss-meta {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: 0.5rem;
}

.meta-row {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.4rem 0;
}

.meta-label {
  font-size: 0.65rem;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.meta-value {
  font-size: 0.8rem;
}

.meta-highlight {
  color: var(--highlight-color);
}

.drops-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.drop-item {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border: 1px solid var(--border-color);
  border-radius: 2px;
}

.npc-phase {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 0.8rem 0;
  border-top: 1px solid var(--border-color);
}

.phase-title {
  font-size: 0.85rem;
  color: var(--highlight-color);
  margin: 0;
  opacity: 0.85;
}

.npc-name {
  font-size: 0.7rem;
  opacity: 0.5;
  font-weight: normal;
}

.boss-attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin: 0.3rem 0 0.5rem;
}

.npc-attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin: 0.3rem 0 0.5rem;
}

.attr-badge {
  font-size: 0.6rem;
  padding: 0.15rem 0.4rem;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border: 1px solid var(--border-color);
  opacity: 0.7;
}

.attr-badge.def {
  color: var(--main-font-color);
  border-color: var(--border-color);
}

.attr-badge.positive {
  color: rgb(34, 197, 94);
  border-color: rgba(34, 197, 94, 0.4);
  background: rgba(34, 197, 94, 0.08);
}

.attr-badge.negative {
  color: var(--main-font-color);
  opacity: 0.35;
  border-color: var(--border-color);
}

.attr-badge.type {
  color: var(--main-font-color);
  text-transform: none;
  letter-spacing: normal;
}

.attr-badge.night {
  color: rgb(139, 148, 255);
  border-color: rgba(139, 148, 255, 0.4);
  background: rgba(139, 148, 255, 0.08);
}

.attr-badge.dlc-tag {
  color: var(--highlight-color);
  border-color: rgba(181, 158, 98, 0.5);
  background: rgba(181, 158, 98, 0.1);
}

.attr-badge.great-rune {
  color: rgb(255, 215, 0);
  border-color: rgba(255, 215, 0, 0.4);
  background: rgba(255, 215, 0, 0.08);
}

.attr-badge.remembrance {
  color: rgb(192, 192, 210);
  border-color: rgba(192, 192, 210, 0.4);
  background: rgba(192, 192, 210, 0.08);
}

.npc-stats-tall {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: 0.5rem;
  margin: 0.3rem 0;
  padding: 0.2rem 0;
}

.phase-data {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.data-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.section-title {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
  margin: 0;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid var(--border-color);
  border-bottom-color: rgba(89, 88, 84, 0.3);
}

.negation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
  gap: 0.3rem;
}

.stance-grid {
  grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
}

.data-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.4rem 0.3rem;
  text-align: center;
  border: 1px solid var(--border-color);
  border-radius: 2px;
  font-size: 0.65rem;
  transition: all 0.2s;
}

.data-cell:hover {
  border-color: var(--highlight-color);
}

.data-label {
  opacity: 0.5;
  text-transform: uppercase;
  font-size: 0.55rem;
  letter-spacing: 0.03em;
}

.data-value {
  font-size: 0.7rem;
}

.data-cell.vulnerable {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.data-cell.vulnerable .data-value {
  color: rgb(34, 197, 94);
}

.data-cell.resistant {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.data-cell.resistant .data-value {
  color: rgb(239, 68, 68);
}

.data-cell.immune {
  background: rgba(234, 179, 8, 0.1);
  border-color: rgba(234, 179, 8, 0.3);
}

.data-cell.immune .data-value {
  color: rgb(234, 179, 8);
  font-style: italic;
}

.boss-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.boss-not-found p {
  color: var(--main-font-color);
  opacity: 0.5;
}

.boss-videos {
  padding: 0.8rem 0;
  border-top: 1px solid var(--border-color);
}

.boss-videos-title {
  font-size: 0.85rem;
  color: var(--highlight-color);
  margin: 0;
  opacity: 0.85;
}

.youtube-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  margin: 0.8rem 0;
}

.youtube-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
