<script setup lang="ts">
import LoadingIndicator from './LoadingIndicator.vue'
import { storeToRefs } from 'pinia'
import { useSaveStore } from '@/stores/save'

const saveStore = useSaveStore()
const { readFile, connectFile, setActiveSlotId } = saveStore
const { isLoading } = storeToRefs(saveStore)

const supportsFilePicker = typeof window.showOpenFilePicker !== 'undefined'

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  await readFile(file)
  setActiveSlotId(0)
}

async function openFilePicker() {
  try {
    const [handle] = await window.showOpenFilePicker({
      types: [{ accept: { '*/*': ['.sl2'] } }],
      excludeAcceptAllOption: true,
    })
    await connectFile(handle)
  } catch (err: unknown) {
    if ((err as DOMException).name !== 'AbortError') {
      throw err
    }
  }
}
</script>

<template>
  <div class="upload bordered-content">
    <div class="heading-1">{{ $t('appTitle') }}</div>
    <div class="divider"></div>
    <p>
      {{ $t('uploadConnectSave') }}
    </p>
    <p class="file-path">%APPDATA%\EldenRing\&lt;STEAM_ID&gt;\ER0000.sl2</p>
    <p>
      {{ $t('uploadDownloadFrom') }}
      <a href="https://store.steampowered.com/account/remotestorageapp/?appid=1245620" target="_blank">{{
        $t('uploadSteamCloud')
      }}</a>
    </p>

    <LoadingIndicator v-if="isLoading" :message="$t('uploadLoadingSave')" :size="2" />
    <div v-else>
      <button v-if="supportsFilePicker" class="button button-lg" @click="openFilePicker">
        {{ $t('uploadSaveFile') }}
      </button>

      <template v-else>
        <label for="file-upload" class="button button-lg">{{ $t('uploadSaveFile') }}</label>
        <input class="d-none" id="file-upload" type="file" accept=".sl2" @change="onFileChange" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.upload {
  text-align: center;
}

.file-path {
  color: var(--main-font-color);
  opacity: 0.6;
  font-family: monospace;
}

.upload .button {
  display: inline-block;
  margin-top: 1rem;
}

.divider {
  margin: 1.8rem;
  background: var(--divider-gradient);
  height: 2px;
}
</style>
