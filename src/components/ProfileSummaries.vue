<script setup lang="ts">
import ProfileSummary from './ProfileSummary.vue'

import { useSaveStore } from '@/stores/save'
import { storeToRefs } from 'pinia'

const saveStore = useSaveStore()
const { save } = storeToRefs(saveStore)
const { setActiveSlotId, resetSaveFile } = saveStore

function goBack() {
  resetSaveFile()
}
</script>

<template>
  <div class="profile-summaries">
    <!-- <div class="select-character">{{ $t('selectCharacter') }}</div> -->
    <ProfileSummary
      v-for="(profileSummary, i) in save?.profileSummaries"
      v-bind:key="profileSummary.name"
      :profile-summary="profileSummary"
      @click="setActiveSlotId(i)"
    />
    <button class="button" @click="goBack">{{ $t('selectDifferentSave') }}</button>
  </div>
</template>

<!-- <div>
    <pre><code>{{ save }}</code></pre>
  </div> -->

<style scoped>
.profile-summaries {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
</style>
