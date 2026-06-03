<script setup lang="ts">
import { computed } from 'vue'

import erAstrologerMale from '@/assets/img/er-astrologer-male.png'
import erAstrologerFemale from '@/assets/img/er-astrologer-female.png'

import erSamuraiMale from '@/assets/img/er-samurai-male.png'
import erSamuraiFemale from '@/assets/img/er-samurai-female.png'

import erWretchMale from '@/assets/img/er-wretch-male.png'
import erWretchFemale from '@/assets/img/er-wretch-female.png'

interface CharInfo {
  archetype?: number
  bodyType?: number
}

const props = defineProps<{
  char: CharInfo
}>()

const characterImage = computed<string | undefined>(() => {
  if (props.char?.archetype != null) {
    switch (props.char.archetype) {
      case 4:
        return props.char.bodyType === 0 ? erAstrologerFemale : erAstrologerMale
      case 7:
        return props.char.bodyType === 0 ? erSamuraiFemale : erSamuraiMale
      case 9:
        return props.char.bodyType === 0 ? erWretchFemale : erWretchMale
    }
  }
  return undefined
})
</script>

<template>
  <img v-if="characterImage" :src="characterImage" />
</template>

<style scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
