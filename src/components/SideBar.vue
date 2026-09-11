<script setup lang="ts">
import { watch } from 'vue'

import { storeToRefs } from 'pinia'

import CharacterOverview from '@/components/CharacterOverview.vue'
import LiveSyncStatus from '@/components/LiveSyncStatus.vue'
import ProfileSummaries from '@/components/ProfileSummaries.vue'
import ProgressionSummary from '@/components/ProgressionSummary.vue'
import SaveFileUpload from '@/components/SaveFileUpload.vue'
import SaveInfo from '@/components/SaveInfo.vue'
import TrackChanges from '@/components/TrackChanges.vue'

import { useSaveStore } from '@/stores/save'
import { useTrackChangesStore } from '@/stores/trackChanges'

const saveStore = useSaveStore()
const { save, activeSlot, activeSlotId } = storeToRefs(saveStore)
const trackChangesStore = useTrackChangesStore()

watch(activeSlotId, () => {
  scrollTo({ top: 0 })
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
  transition: transform 0.2s ease;
  background: var(--main-bg-color);
  z-index: 1099;
  transform: translateX(-100%);
}

.sidebar-open .overview {
  transform: translateX(0);
}
</style>
