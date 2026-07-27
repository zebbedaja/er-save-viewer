<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSaveStore } from '@/stores/save'

const saveStore = useSaveStore()
const { save } = storeToRefs(saveStore)
</script>

<template>
  <div class="bordered-content">
    <div class="save-info-title heading-1">
      {{ $t('saveInfo') }}
    </div>

    <div class="meta-grid">
      <div class="mini-stat">
        <span class="mini-label">{{ $t('saveVersion') }}</span>
        <span class="mini-value">{{ save?.version ?? '—' }}</span>
      </div>
      <div class="mini-stat">
        <span class="mini-label">{{ $t('steamId') }}</span>
        <span class="mini-value">{{ save?.steamId ?? '—' }}</span>
      </div>
      <div class="mini-stat">
        <span class="mini-label">{{ $t('checksum') }}</span>
        <span class="mini-value monospace">{{ save?.checksum ?? '—' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bordered-content {
  gap: 0.6rem;
}

.save-info-title {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.6rem;
  margin-bottom: 1rem;
}

.meta-grid {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
</style>
