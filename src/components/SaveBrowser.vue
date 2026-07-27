<script setup lang="ts">
import { watch } from 'vue'
import { useSaveStore } from '@/stores/save'
import { useTrackChangesStore } from '@/stores/trackChanges'
import { storeToRefs } from 'pinia'
import SaveFileUpload from './SaveFileUpload.vue'
import ProfileSummaries from './ProfileSummaries.vue'
import CharacterOverview from './CharacterOverview.vue'
import ProgressionSummary from './ProgressionSummary.vue'
import LiveSyncStatus from './LiveSyncStatus.vue'
import TrackChanges from './TrackChanges.vue'
import SaveInfo from './SaveInfo.vue'

const saveStore = useSaveStore()
const { save, activeSlot, activeSlotId } = storeToRefs(saveStore)
const trackChangesStore = useTrackChangesStore()

watch(activeSlotId, () => {
  window.scrollTo({ top: 0 })
})
</script>

<template>
  <div class="save-browser">
    <div class="overview">
      <SaveFileUpload v-if="save == null" />
      <ProfileSummaries v-if="activeSlot == null && save != null" />
      <CharacterOverview v-if="activeSlot != null" :saveSlot="activeSlot" />
      <ProgressionSummary v-if="activeSlot != null" :saveSlot="activeSlot" />
      <TrackChanges v-if="activeSlot != null && trackChangesStore.trackChangesMode" />

      <template v-if="save != null">
        <SaveInfo />
        <LiveSyncStatus />
      </template>
    </div>
    <div class="container">
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
  grid-template-columns: 420px minmax(0, 1fr);
  gap: 1rem;
}

@media (max-width: 768px) {
  .save-browser {
    grid-template-columns: 100%;
  }
}
</style>
