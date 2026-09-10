<script setup lang="ts">
import { watch } from 'vue'
import { useSaveStore } from '@/stores/save'
import { useTrackChangesStore } from '@/stores/trackChanges'
import { useSidebarStore } from '@/stores/sidebar'
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
const { isSidebarOpen } = storeToRefs(useSidebarStore())

watch(activeSlotId, () => {
  window.scrollTo({ top: 0 })
})
</script>

<template>
  <div class="save-browser" :class="{ 'sidebar-open': isSidebarOpen }">
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
    <div>
      <div class="container-wrapper">
        <div class="container">
          <slot :saveSlot="activeSlot"></slot>
        </div>
      </div>
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
  gap: 2rem;
  overflow-y: auto;
  border-right: 1px solid var(--border-color);
  background-color: var(--sidenav-background);
  transition: transform 0.3s ease;
  background: var(--main-bg-color);
  z-index: 99;
  transform: translateX(-100%);
}

.sidebar-open .overview {
  transform: translateX(0);
}

.sidebar-open .container-wrapper {
  margin-left: calc(380px + 2rem);
}

.container-wrapper {
  margin-left: 0;
  transition: margin-left 0.3s ease;
  padding: 1rem 1rem 2rem 1rem;
}

.save-browser {
  gap: 1rem;
  position: relative;
}

@media (max-width: 768px) {
  .container-wrapper, .sidebar-open .container-wrapper {
    margin-left: 0;
  }
}
</style>
