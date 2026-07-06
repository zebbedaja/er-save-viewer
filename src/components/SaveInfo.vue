<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSaveStore } from '@/stores/save'

const saveStore = useSaveStore()
const { save } = storeToRefs(saveStore)
</script>

<template>
  <div class="bordered-content">
    <div class="title-row">
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
  padding: 0.8rem;
  gap: 0.6rem;
}

.title-row {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.4rem;
}

.meta-grid {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.mini-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0.4rem;
  font-size: 0.75rem;
  background: var(--hover-background);
}

.mini-label {
  opacity: 0.7;
}

.mini-value {
  color: var(--highlight-color);
  font-weight: bold;
}

.monospace {
  font-family: monospace;
  word-break: break-all;
}
</style>
