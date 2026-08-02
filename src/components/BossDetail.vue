<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSaveStore } from '@/stores/save'
import { useEncounterStore } from '@/stores/encounter'
import type { ResistanceValue } from '@/model/types'
import { formatNumber } from '@/util'
import ProgressBarCenter from './ProgressBarCenter.vue'
import ProgressBar from './ProgressBar.vue'
import { useI18n } from 'vue-i18n'
import { YOUTUBE_VIDEOS } from '@/model/youtube.ts'

const { t } = useI18n()
const saveStore = useSaveStore()
const encounterStore = useEncounterStore()

const route = useRoute()
const router = useRouter()

const flagId = computed(() => Number(route.params.flagId))
const boss = computed(() => encounterStore.getByFlagId(flagId.value))

const isDefeated = computed(() => saveStore.defeatedFlags.has(flagId.value))

const youtubeVideo = computed(() => YOUTUBE_VIDEOS.find((v) => v.flagId === flagId.value))

function goBack() {
  router.back()
}

function formatResistanceThresholds(resistance: ResistanceValue): string {
  return resistance.immune
    ? t('immune')
    : resistance.thresholds.filter((t, i) => i === 0 || t !== resistance.thresholds[i - 1]).join(' / ')
}

function calculateResistancePercentage(resistance: ResistanceValue): number {
  return resistance.immune ? Number.MAX_VALUE : (resistance?.thresholds?.[0] ?? 0) / 20
}

const bossImages = import.meta.glob<{ default: string }>('../assets/img/bosses/*.jpg', { eager: true })

function getNpcImageUrl(npcId: number): string | undefined {
  const key = Object.keys(bossImages).find((k) => k.includes(`${npcId}.jpg`))
  return key ? bossImages[key]?.default : undefined
}

const npcImageUrls = computed(() =>
  boss?.value?.npcs?.map((npc) => getNpcImageUrl(npc.id)).filter((url) => url != null),
)

const bossYouTubeImages = import.meta.glob<{ default: string }>('../assets/img/bosses-youtube/*.jpg', { eager: true })

function getYouTubeImageUrl(flagId: number): string | undefined {
  const key = Object.keys(bossYouTubeImages).find((k) => k.includes(`${flagId}`))
  return key ? bossYouTubeImages[key]?.default : undefined
}

function getYouTubeUrl(): string | undefined {
  return 'https://www.youtube.com/watch?v=' + youtubeVideo.value?.youTubeId
}

function getYouTubeTitle(): string | undefined {
  return youtubeVideo.value?.youTubeTitle
}

function getYouTubeUser(): string | undefined {
  return youtubeVideo.value?.youTubeUser
}
</script>

<template>
  <div class="boss-detail bordered-content" v-if="boss">
    <div class="boss-detail-header">
      <button class="button button-sm" @click="goBack">{{ $t('backToBosses') }}</button>
      <div class="boss-title-row">
        <span class="boss-icon" v-if="isDefeated">&#x2714;</span>
        <h2 class="boss-name">{{ boss.flagName }}</h2>
      </div>

      <div class="boss-attributes">
        <span class="attr-badge type">
          {{ boss.type }}
        </span>
        <span v-if="boss.nightOnly" class="attr-badge night">
          {{ $t('nightOnly') }}
        </span>
        <span v-if="boss.dlc" class="attr-badge dlc-tag">
          {{ $t('dlc') }}
        </span>
        <span v-if="boss.hasGreatRune" class="attr-badge great-rune">
          {{ $t('greatRune') }}
        </span>
        <span v-if="boss.hasRemembrance" class="attr-badge remembrance">
          {{ $t('remembrance') }}
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
        <span class="meta-label">{{ $t('level') }}</span>
        <span class="meta-value meta-highlight">{{ formatNumber(boss.level ?? 0) }}</span>
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
        {{ $t('phase') }} {{ npc.phase }} &mdash;
        <span class="npc-name">{{ npc.name }}</span>
      </h3>

      <div class="npc-attributes">
        <span v-if="npc.stanceCritical" class="attr-badge positive">
          {{ $t('vulnerableToCriticalHit') }}
        </span>
        <span v-if="npc.parryable" class="attr-badge positive">
          {{
            $t('parryable') +
            (npc.numberOfParries != null && npc.numberOfParries > 1
              ? ' (' + $t('requiresNParries', { count: npc.numberOfParries }) + ')'
              : '')
          }}
        </span>
        <span v-if="npc.backstab" class="attr-badge positive">
          {{ $t('backstabable') }}
        </span>
        <span v-if="npc.human" class="attr-badge positive">
          {{ $t('human') }}
        </span>
        <span v-if="npc.void" class="attr-badge void">
          {{ $t('void') }}
        </span>
        <span v-if="npc.dragon" class="attr-badge dragon">
          {{ $t('dragon') }}
        </span>
        <span v-if="npc.ancientDragon" class="attr-badge ancient-dragon">
          {{ $t('ancientDragon') }}
        </span>
        <span v-if="npc.thoseWhoLiveInDeath" class="attr-badge those-who-live-in-death">
          {{ $t('thoseWhoLiveInDeath') }}
        </span>
        <span v-if="npc.undead" class="attr-badge undead">
          {{ $t('undead') }}
        </span>
      </div>

      <div class="npc-stats-tall">
        <div class="meta-row">
          <span class="meta-label">{{ $t('hp') }}</span>
          <span class="meta-value meta-highlight">{{ formatNumber(npc.hp) }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">{{ $t('poise') }}</span>
          <span class="meta-value meta-highlight"
            >{{ formatNumber(npc.poise.base) }} {{ npc.poise.absorption !== 1 ? `(${npc.poise.effective})` : '' }}</span
          >
        </div>
        <div class="meta-row">
          <span class="meta-label">{{ $t('poise') }} {{ $t('delay') }}</span>
          <span class="meta-value meta-highlight">{{ formatNumber(npc.poise.regenDelay) }}s</span>
        </div>
        <div class="meta-row">
          <span class="meta-label"
            >{{ $t('defense') }} <span v-if="npc.human">({{ $t('physical') }})</span></span
          >
          <span class="meta-value meta-highlight">{{ formatNumber(npc.defense.physical) }}</span>
        </div>
        <div class="meta-row" v-if="npc.human">
          <span class="meta-label">{{ $t('defense') }} ({{ $t('magic') }})</span>
          <span class="meta-value meta-highlight">{{ formatNumber(npc.defense.magic) }}</span>
        </div>
        <div class="meta-row" v-if="npc.human">
          <span class="meta-label">{{ $t('defense') }} ({{ $t('fire') }})</span>
          <span class="meta-value meta-highlight">{{ formatNumber(npc.defense.fire) }}</span>
        </div>
        <div class="meta-row" v-if="npc.human">
          <span class="meta-label">{{ $t('defense') }} ({{ $t('lightning') }})</span>
          <span class="meta-value meta-highlight">{{ formatNumber(npc.defense.lightning) }}</span>
        </div>
        <div class="meta-row" v-if="npc.human">
          <span class="meta-label">{{ $t('defense') }} ({{ $t('holy') }})</span>
          <span class="meta-value meta-highlight">{{ formatNumber(npc.defense.holy) }}</span>
        </div>
        <div class="meta-row" v-if="npc.weakPart">
          <span class="meta-label">{{ $t('weakPart') }}</span>
          <span class="meta-value meta-highlight"> {{ npc.weakPart }} (x{{ npc.weakPartsDamageRate }}) </span>
        </div>
        <div class="meta-row" v-if="npc.inflictedDamageTypes?.length">
          <span class="meta-label">{{ $t('inflictedDamageTypes') }}</span>
          <span class="meta-value drops-list">
            <span class="drop-item" v-for="dt in npc.inflictedDamageTypes" :key="dt">{{ dt }}</span>
          </span>
        </div>
        <div class="meta-row" v-if="npc.inflictedStatusEffects?.length">
          <span class="meta-label">{{ $t('inflictedStatusEffects') }}</span>
          <span class="meta-value drops-list">
            <span class="drop-item" v-for="se in npc.inflictedStatusEffects" :key="se">{{ se }}</span>
          </span>
        </div>
      </div>

      <div class="phase-data">
        <div class="data-section">
          <h4 class="section-title-bar">{{ $t('negation') }}</h4>
          <div class="negation-bar-grid">
            <div>{{ $t('standard') }}</div>
            <ProgressBarCenter :percentage="npc.negation.standard"></ProgressBarCenter>
            <div>{{ npc.negation.standard }}%</div>
            <div>{{ $t('strike') }}</div>
            <ProgressBarCenter :percentage="npc.negation.strike"></ProgressBarCenter>
            <div>{{ npc.negation.strike }}%</div>
            <div>{{ $t('slash') }}</div>
            <ProgressBarCenter :percentage="npc.negation.slash"></ProgressBarCenter>
            <div>{{ npc.negation.slash }}%</div>
            <div>{{ $t('pierce') }}</div>
            <ProgressBarCenter :percentage="npc.negation.pierce"></ProgressBarCenter>
            <div>{{ npc.negation.pierce }}%</div>
            <div>{{ $t('magic') }}</div>
            <ProgressBarCenter :percentage="npc.negation.magic"></ProgressBarCenter>
            <div>{{ npc.negation.magic }}%</div>
            <div>{{ $t('fire') }}</div>
            <ProgressBarCenter :percentage="npc.negation.fire"></ProgressBarCenter>
            <div>{{ npc.negation.fire }}%</div>
            <div>{{ $t('lightning') }}</div>
            <ProgressBarCenter :percentage="npc.negation.lightning"></ProgressBarCenter>
            <div>{{ npc.negation.lightning }}%</div>
            <div>{{ $t('holy') }}</div>
            <ProgressBarCenter :percentage="npc.negation.holy"></ProgressBarCenter>
            <div>{{ npc.negation.holy }}%</div>
          </div>
        </div>

        <div class="data-section">
          <h4 class="section-title-bar">{{ $t('resistance') }}</h4>
          <div class="negation-bar-grid">
            <div>{{ $t('poison') }}</div>
            <ProgressBar :percentage="calculateResistancePercentage(npc.resistance.poison)"></ProgressBar>
            <div :class="{ immune: npc?.resistance?.poison?.immune }">
              {{ formatResistanceThresholds(npc.resistance.poison) }}
            </div>
            <div>{{ $t('rot') }}</div>
            <ProgressBar :percentage="calculateResistancePercentage(npc.resistance.scarletRot)"></ProgressBar>
            <div :class="{ immune: npc?.resistance?.scarletRot?.immune }">
              {{ formatResistanceThresholds(npc.resistance.scarletRot) }}
            </div>
            <div>{{ $t('bleed') }}</div>
            <ProgressBar :percentage="calculateResistancePercentage(npc.resistance.bloodLoss)"></ProgressBar>
            <div :class="{ immune: npc?.resistance?.bloodLoss?.immune }">
              {{ formatResistanceThresholds(npc.resistance.bloodLoss) }}
            </div>
            <div>{{ $t('frost') }}</div>
            <ProgressBar :percentage="calculateResistancePercentage(npc.resistance.frostBite)"></ProgressBar>
            <div :class="{ immune: npc?.resistance?.frostBite?.immune }">
              {{ formatResistanceThresholds(npc.resistance.frostBite) }}
            </div>
            <div>{{ $t('sleep') }}</div>
            <ProgressBar :percentage="calculateResistancePercentage(npc.resistance.sleep)"></ProgressBar>
            <div :class="{ immune: npc?.resistance?.sleep?.immune }">
              {{ formatResistanceThresholds(npc.resistance.sleep) }}
            </div>
            <div>{{ $t('madness') }}</div>
            <ProgressBar :percentage="calculateResistancePercentage(npc.resistance.madness)"></ProgressBar>
            <div :class="{ immune: npc?.resistance?.madness?.immune }">
              {{ formatResistanceThresholds(npc.resistance.madness) }}
            </div>
            <div>{{ $t('deathblight') }}</div>
            <ProgressBar :percentage="calculateResistancePercentage(npc.resistance.deathBlight)"></ProgressBar>
            <div :class="{ immune: npc?.resistance?.deathBlight?.immune }">
              {{ formatResistanceThresholds(npc.resistance.deathBlight) }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="npc.human && npc.stats.runeLevel != null" class="data-section">
        <h4 class="section-title-bar">{{ $t('stats') }}</h4>
        <div class="stats-grid">
          <div class="data-cell">
            <span class="data-label">{{ $t('runeLevel') }}</span>
            <span class="data-value">{{ npc.stats.runeLevel }}</span>
          </div>
          <div class="data-cell">
            <span class="data-label">{{ $t('vigor') }}</span>
            <span class="data-value">{{ npc.stats.vigor }}</span>
          </div>
          <div class="data-cell">
            <span class="data-label">{{ $t('mind') }}</span>
            <span class="data-value">{{ npc.stats.mind }}</span>
          </div>
          <div class="data-cell">
            <span class="data-label">{{ $t('endurance') }}</span>
            <span class="data-value">{{ npc.stats.endurance }}</span>
          </div>
          <div class="data-cell">
            <span class="data-label">{{ $t('strength') }}</span>
            <span class="data-value">{{ npc.stats.strength }}</span>
          </div>
          <div class="data-cell">
            <span class="data-label">{{ $t('dexterity') }}</span>
            <span class="data-value">{{ npc.stats.dexterity }}</span>
          </div>
          <div class="data-cell">
            <span class="data-label">{{ $t('intelligence') }}</span>
            <span class="data-value">{{ npc.stats.intelligence }}</span>
          </div>
          <div class="data-cell">
            <span class="data-label">{{ $t('faith') }}</span>
            <span class="data-value">{{ npc.stats.faith }}</span>
          </div>
          <div class="data-cell">
            <span class="data-label">{{ $t('arcane') }}</span>
            <span class="data-value">{{ npc.stats.arcane }}</span>
          </div>
        </div>
      </div>

      <div v-if="npc.human && npc.armor.helm" class="data-section">
        <h4 class="section-title-bar">{{ $t('equipment') }}</h4>
        <div class="equipment-grid">
          <div class="data-cell">
            <span class="data-label">{{ $t('helm') }}</span>
            <span class="data-value">{{ npc.armor.helm }}</span>
          </div>
          <div class="data-cell">
            <span class="data-label">{{ $t('chest') }}</span>
            <span class="data-value">{{ npc.armor.chestArmor }}</span>
          </div>
          <div class="data-cell">
            <span class="data-label">{{ $t('gauntlets') }}</span>
            <span class="data-value">{{ npc.armor.gauntlets }}</span>
          </div>
          <div class="data-cell">
            <span class="data-label">{{ $t('legs') }}</span>
            <span class="data-value">{{ npc.armor.legArmor }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="boss-videos" v-if="youtubeVideo != null">
      <h3 class="boss-videos-title">{{ $t('bossKills') }}</h3>
      <a :href="getYouTubeUrl()" target="_blank">
        <div class="boss-video-wrapper">
          <img class="npc-image" :src="getYouTubeImageUrl(boss.flagId)" />
          <div class="boss-video-title">
            {{ getYouTubeTitle() }}<br /><span class="boss-video-user">{{ getYouTubeUser() }}</span>
          </div>
          <div class="boss-video-play-button-wrapper">
            <div class="boss-video-play-button">
              <div class="boss-video-play-button-triangle"></div>
            </div>
          </div>
        </div>
      </a>
    </div>

    <div class="boss-images" v-if="npcImageUrls?.length !== 0">
      <h3 class="boss-videos-title">{{ $t('bossImages') }}</h3>
      <div v-for="(url, index) in npcImageUrls" :key="index">
        <img :src="url" class="npc-image" />
      </div>
    </div>
  </div>

  <div class="boss-not-found" v-else>
    <button class="button" @click="goBack">{{ $t('backToBosses') }}</button>
    <p>{{ $t('bossNotFound') }}</p>
  </div>
</template>

<style scoped>
.boss-detail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
}

.boss-detail-header {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.boss-detail-header .button {
  align-self: start;
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

.npc-image {
  width: 100%;
  display: block;
}

.npc-phase {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
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
  font-weight: normal;
}

.npc-stats-tall {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: 0.5rem;
  margin: 0.3rem 0;
  padding: 0.2rem 0;
}

.phase-data {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 2rem;
}

.data-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
  gap: 0.4rem;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: 0.4rem;
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
  padding-top: 0.8rem;
  border-top: 1px solid var(--border-color);
}

.boss-videos-title {
  font-size: 0.85rem;
  color: var(--highlight-color);
}

.boss-video-wrapper {
  position: relative;
}

.boss-video-play-button-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.boss-video-play-button {
  background: rgb(239, 68, 68);
  border-radius: 18%/32%;
  width: 5rem;
  height: 3.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.boss-video-play-button-triangle {
  width: 24%;
  height: 40%;
  margin-left: 0.2rem;
  background: var(--main-font-color);
  clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
}

.boss-video-title {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 100px;
  color: var(--main-font-color);
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.3rem;
  font-weight: bold;
  padding: 1rem 2rem;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0));
  white-space: nowrap;
  line-height: 1;
}

.boss-video-user {
  font-size: 0.8rem;
  font-weight: 100;
}

.boss-images {
  padding-top: 0.8rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.negation-bar-grid {
  font-size: 0.8rem;
  display: grid;
  gap: 0.5rem 2rem;
  grid-template-columns: max-content 1fr max-content;
  align-items: center;
}

.negation-bar-grid div:nth-child(3n) {
  justify-self: end;
}

.immune {
  color: var(--highlight-color);
  font-style: italic;
}

.section-title-bar {
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  margin: 0;
  padding-bottom: 0.2rem;
}

.npc-attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin: 0rem 0 0.5rem;
}

@media (max-width: 520px) {
  .npc-stats-tall {
    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
  }
}
</style>
