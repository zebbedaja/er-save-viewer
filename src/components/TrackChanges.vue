<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSaveStore } from '@/stores/save'

const saveStore = useSaveStore()
const { differences } = storeToRefs(saveStore)

const hasDifferences = computed(() => differences.value.length > 0)
</script>

<template>
  <div class="track-changes">
    <h3>{{ $t('eventFlags') }}</h3>
    <div v-if="!hasDifferences" class="empty-state">
      {{ $t('trackChangesEmpty') }}
    </div>
    <div v-else class="changes-list">
      <div v-for="diff in differences" :key="`${diff.offset}-${diff.bitIndex}`" class="change-row">
        <span class="change-id">Event #{{ diff.eventId }}</span>
        <span class="change-detail">
          Offset: {{ diff.offset }}, Bit: {{ diff.bitIndex }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.track-changes {
  background: var(--card-bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1rem;
}

.track-changes h3 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  color: var(--highlight-color);
}

.empty-state {
  color: var(--main-font-color);
  opacity: 0.5;
  font-size: 0.85rem;
  text-align: center;
  padding: 0.75rem 0;
}

.changes-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.change-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0.5rem;
  background: var(--hover-background);
  border-radius: 4px;
  font-size: 0.8rem;
}

.change-id {
  font-weight: bold;
  color: var(--main-font-color);
}

.change-detail {
  color: var(--main-font-color);
  opacity: 0.6;
  font-family: monospace;
  font-size: 0.75rem;
}
</style>
