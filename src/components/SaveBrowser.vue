<script setup lang="ts">
import CharacterOverview from './CharacterOverview.vue'

import { useSaveStore } from '@/stores/save'
import { storeToRefs } from 'pinia'
import SaveFileUpload from './SaveFileUpload.vue'
import ProfileSummaries from './ProfileSummaries.vue'
import BossProgress from './BossProgress.vue'

const saveStore = useSaveStore()
const { save, activeSlot } = storeToRefs(saveStore)
</script>

<template>
  <div class="save-browser">
    <div class="overview">
      <SaveFileUpload v-if="save == null"></SaveFileUpload>
      <ProfileSummaries v-if="activeSlot == null && save != null"></ProfileSummaries>
      <CharacterOverview v-if="activeSlot != null" :saveSlot="activeSlot"></CharacterOverview>
      <BossProgress v-if="activeSlot != null" :saveSlot="activeSlot"></BossProgress>
    </div>
    <div>
      <slot :saveSlot="activeSlot"></slot>
    </div>
  </div>
</template>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.save-browser {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
}

@media (max-width: 800px) {
  .save-browser {
    grid-template-columns: 1fr;
  }
}
</style>
