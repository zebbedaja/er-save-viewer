<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useSaveStore } from '@/stores/save'

const saveStore = useSaveStore()
const { isLiveSyncActive, lastModified } = storeToRefs(saveStore)

const { t, locale } = useI18n()

const formattedTime = computed(() => {
  if (!lastModified.value) return ''
  const formatter = new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  return t('uploadLastModified', { time: formatter.format(new Date(lastModified.value)) })
})
</script>

<template>
  <div v-if="isLiveSyncActive" class="live-sync">
    <span class="pulse" />
    {{ $t('uploadLiveSyncActive') }} — {{ formattedTime }}
  </div>
</template>

<style scoped>
.live-sync {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--link-color);
  font-size: 0.85rem;
}

.pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  animation: pulse-anim 1.5s ease-in-out infinite;
}

@keyframes pulse-anim {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
