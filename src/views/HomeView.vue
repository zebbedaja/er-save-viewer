<script setup lang="ts">
import { RouterView } from 'vue-router'

import SaveBrowser from '@/components/SaveBrowser.vue'
</script>

<template>
  <main>
    <SaveBrowser v-slot="{ saveSlot }">
      <RouterView :saveSlot="saveSlot" />
    </SaveBrowser>
  </main>
</template>
