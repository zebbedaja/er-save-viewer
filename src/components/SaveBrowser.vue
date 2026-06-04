<script setup lang="ts">
import { useSaveStore } from '@/stores/save'
import { storeToRefs } from 'pinia'
import SaveFileUpload from './SaveFileUpload.vue'
import ProfileSummaries from './ProfileSummaries.vue'
import CharacterOverview from './CharacterOverview.vue'
import ProgressionSummary from './ProgressionSummary.vue'
import LiveSyncStatus from './LiveSyncStatus.vue'

const saveStore = useSaveStore()
const { save, activeSlot } = storeToRefs(saveStore)
</script>

<template>
  <div class="save-browser">
    <div class="overview">
      <SaveFileUpload v-if="save == null" />
      <ProfileSummaries v-if="activeSlot == null && save != null" />
      <CharacterOverview v-if="activeSlot != null" :saveSlot="activeSlot" />
      <ProgressionSummary v-if="activeSlot != null" :saveSlot="activeSlot" />

      <template v-if="save != null">
        <LiveSyncStatus />
      </template>
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
