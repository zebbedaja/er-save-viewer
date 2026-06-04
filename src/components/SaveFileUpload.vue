<script setup lang="ts">
import LoadingIndicator from './LoadingIndicator.vue'
import { storeToRefs } from 'pinia'
import { useSaveStore } from '@/stores/save'

const saveStore = useSaveStore()
const { readFile, setActiveSlotId } = saveStore
const { isLoading } = storeToRefs(saveStore)

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  await readFile(file)
  setActiveSlotId(0)
}
</script>

<template>
  <div class="upload bordered-content">
    <div class="headline">{{ $t('appTitle') }}</div>
    <div class="divider"></div>
    <p>
      {{ $t('uploadConnectSave') }}
    </p>
    <p>%APPDATA%\EldenRing\&lt;YOUR_STEAM_ID&gt;\ER0000.sl2</p>
    <p>
      {{ $t('uploadDownloadFrom') }}<br />
      <a href="https://store.steampowered.com/account/remotestorageapp/?appid=1245620" target="_blank">{{ $t('uploadSteamCloud') }}</a>
    </p>

    <LoadingIndicator v-if="isLoading" :message="$t('uploadLoadingSave')" :size="2" />
    <div v-else>
      <label for="file-upload" class="button button-lg">{{ $t('uploadSaveFile') }}</label>
      <input class="d-none" id="file-upload" type="file" @change="onFileChange" />
    </div>
  </div>
</template>

<style scoped>
.upload {
  text-align: center;
}

.headline {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--link-color);
}

.upload .button {
  display: inline-block;
  margin-top: 1rem;
}

.divider {
  margin: 2rem;
  background: var(--divider-gradient);
  height: 2px;
}
</style>
