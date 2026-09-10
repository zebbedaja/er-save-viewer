<script setup lang="ts">
import { useSaveStore } from '@/stores/save'
import { storeToRefs } from 'pinia'

const saveStore = useSaveStore()
const { activeSlot } = storeToRefs(saveStore)
</script>

<template>
  <div class="container-wrapper">
    <div class="container">
      <slot :saveSlot="activeSlot"></slot>
    </div>
  </div>
</template>

<style scoped>
.sidebar-open .container-wrapper {
  margin-left: calc(380px + 2rem);
}

.container-wrapper {
  margin-left: 0;
  transition: margin-left 0.3s ease;
  padding: 1rem 1rem 2rem 1rem;
}

@media (max-width: 768px) {
  .container-wrapper,
  .sidebar-open .container-wrapper {
    margin-left: 0;
  }
}
</style>
