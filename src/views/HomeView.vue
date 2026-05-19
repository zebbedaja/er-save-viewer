<script setup lang="ts">
import SaveBrowser from '@/components/SaveBrowser.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <main>
    <SaveBrowser v-slot="{ saveSlot }">
      <RouterView :saveSlot="saveSlot" />
    </SaveBrowser>
  </main>
</template>

