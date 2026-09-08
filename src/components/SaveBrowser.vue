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
  position: fixed;
  width: 380px;
  top: 3.5rem;
  height: calc(100dvh - 6.5rem);
  padding: 1rem 1rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  overflow-y: auto;
  border-right: 1px solid var(--border-color);
  background-color: var(--sidenav-background);
}

.container {
  grid-column-start: 2;
  padding: 1rem 1rem 2rem 1rem;
}

.save-browser {
  display: grid;
  grid-template-columns: calc(380px + 1rem) minmax(0, 1fr);
  gap: 1rem;
  position: relative;
}

@media (max-width: 768px) {
  .save-browser {
    grid-template-columns: 100%;
  }

  .overview {
    position: static;
    height: auto;
    width: auto;
    overflow-y: visible;
  }

  .container {
    grid-column-start: initial;
  }
}
</style>
