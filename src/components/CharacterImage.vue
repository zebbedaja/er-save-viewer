<script setup lang="ts">
import { computed } from 'vue'

import erVagabondMale from '@/assets/img/er-vagabond-male.png'
import erVagabondFemale from '@/assets/img/er-vagabond-female.png'

import erWarriorMale from '@/assets/img/er-warrior-male.png'
import erWarriorFemale from '@/assets/img/er-warrior-female.png'

import erHeroMale from '@/assets/img/er-hero-male.png'
import erHeroFemale from '@/assets/img/er-hero-female.png'

import erBanditMale from '@/assets/img/er-bandit-male.png'
import erBanditFemale from '@/assets/img/er-bandit-female.png'

import erAstrologerMale from '@/assets/img/er-astrologer-male.png'
import erAstrologerFemale from '@/assets/img/er-astrologer-female.png'

import erProhpetMale from '@/assets/img/er-prohpet-male.png'
import erProhpetFemale from '@/assets/img/er-prohpet-female.png'

import erSamuraiMale from '@/assets/img/er-samurai-male.png'
import erSamuraiFemale from '@/assets/img/er-samurai-female.png'

import erPrisonerMale from '@/assets/img/er-prisoner-male.png'
import erPrisonerFemale from '@/assets/img/er-prisoner-female.png'

import erConfessorMale from '@/assets/img/er-confessor-male.png'
import erConfessorFemale from '@/assets/img/er-confessor-female.png'

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
      case 0:
        return props.char.bodyType === 0 ? erVagabondFemale : erVagabondMale
      case 1:
        return props.char.bodyType === 0 ? erWarriorFemale : erWarriorMale
      case 2:
        return props.char.bodyType === 0 ? erHeroFemale : erHeroMale
      case 3:
        return props.char.bodyType === 0 ? erBanditFemale : erBanditMale
      case 4:
        return props.char.bodyType === 0 ? erAstrologerFemale : erAstrologerMale
      case 5:
        return props.char.bodyType === 0 ? erProhpetFemale : erProhpetMale
      case 6:
        return props.char.bodyType === 0 ? erSamuraiFemale : erSamuraiMale
      case 7:
        return props.char.bodyType === 0 ? erPrisonerFemale : erPrisonerMale
      case 8:
        return props.char.bodyType === 0 ? erConfessorFemale : erConfessorMale
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
