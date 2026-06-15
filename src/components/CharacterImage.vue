<script setup lang="ts">
import { computed } from 'vue'

import erVagabondMale from '@/assets/img/classes/er-vagabond-male.png'
import erVagabondFemale from '@/assets/img/classes/er-vagabond-female.png'

import erWarriorMale from '@/assets/img/classes/er-warrior-male.png'
import erWarriorFemale from '@/assets/img/classes/er-warrior-female.png'

import erHeroMale from '@/assets/img/classes/er-hero-male.png'
import erHeroFemale from '@/assets/img/classes/er-hero-female.png'

import erBanditMale from '@/assets/img/classes/er-bandit-male.png'
import erBanditFemale from '@/assets/img/classes/er-bandit-female.png'

import erAstrologerMale from '@/assets/img/classes/er-astrologer-male.png'
import erAstrologerFemale from '@/assets/img/classes/er-astrologer-female.png'

import erProhpetMale from '@/assets/img/classes/er-prohpet-male.png'
import erProhpetFemale from '@/assets/img/classes/er-prohpet-female.png'

import erSamuraiMale from '@/assets/img/classes/er-samurai-male.png'
import erSamuraiFemale from '@/assets/img/classes/er-samurai-female.png'

import erPrisonerMale from '@/assets/img/classes/er-prisoner-male.png'
import erPrisonerFemale from '@/assets/img/classes/er-prisoner-female.png'

import erConfessorMale from '@/assets/img/classes/er-confessor-male.png'
import erConfessorFemale from '@/assets/img/classes/er-confessor-female.png'

import erWretchMale from '@/assets/img/classes/er-wretch-male.png'
import erWretchFemale from '@/assets/img/classes/er-wretch-female.png'

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
        return props.char.bodyType === 0 ? erPrisonerFemale : erPrisonerMale
      case 7:
        return props.char.bodyType === 0 ? erSamuraiFemale : erSamuraiMale
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
