<script setup lang="ts">
import BaseTile from './BaseTile.vue'
import { useSaveStore } from '@/stores/save'

const saveStore = useSaveStore()
const { readFile, setActiveSlotId } = saveStore

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  await readFile(file)
  setActiveSlotId(0)
}
</script>

<template>
  <BaseTile class="upload">
    <div class="headline">ER Save Viewer</div>
    <div class="divider"></div>
    <p>
      Connect your Elden Ring save file by uploading it here! The save file location on Windows is
    </p>
    <p>%APPDATA%\EldenRing\&lt;YOUR_STEAM_ID&gt;\ER0000.sl2</p>
    <p>
      You can also download the save file from the<br />
      <a href="https://store.steampowered.com/account/remotestorageapp/?appid=1245620" target="_blank">Steam Cloud</a>
    </p>

    <label for="file-upload" class="button button-lg">{{ $t('uploadSaveFile') }}</label>
    <input class="d-none" id="file-upload" type="file" @change="onFileChange" />
  </BaseTile>
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
