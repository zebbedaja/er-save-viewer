<script setup lang="ts">
import { secondsToHMS } from '@/util'
import type { ProfileSummary } from '@zebbedaja/er-save-parser'

import CharacterImage from '@/components/CharacterImage.vue'

defineProps<{
  profileSummary: ProfileSummary
}>()
</script>

<template>
  <div class="profile-summary button">
    <div class="profile-image">
      <CharacterImage :char="profileSummary" />
    </div>
    <div class="profile-row-1">
      <div class="profile-text">
        {{ profileSummary.name || '&nbsp;' }}
      </div>
      <div class="profile-text level">
        <div>{{ $t('level') }}</div>
        <div class="profile-level">{{ profileSummary.level }}</div>
      </div>
    </div>
    <div class="profile-row-2">
      <div class="profile-text">{{ profileSummary.mapId }}</div>
      <div class="profile-text seconds-played">{{ secondsToHMS(profileSummary.secondsPlayed!) }}</div>
    </div>
  </div>
</template>

<style scoped>
.profile-summary {
  display: flex;
  padding: 0;
  color: var(--main-font-color);
}

.profile-image {
  width: 5rem;
  padding: 0 0 0 0.8rem;
}

.profile-row-1 {
  flex: 1;
  padding: 1rem 1rem 1rem 0.4rem;
  text-align: start;
}

.profile-row-2 {
  width: 120px;
  padding: 1rem 1rem 1rem 2rem;
}

.profile-row-2 .profile-text {
  text-align: end;
}

.profile-text {
  border-bottom: 1px solid var(--border-color);
}

.profile-level {
  padding-right: 1rem;
}

.level {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.seconds-played {
  margin-top: 1rem;
}
</style>
