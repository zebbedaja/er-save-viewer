<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore, type Theme } from '@/stores/theme'
import erWretchFemale from '@/assets/img/er-wretch-female.png'

const { locale } = useI18n()
const themeStore = useThemeStore()

const themeLabels: Record<Theme, string> = {
  dark: 'Dark',
  pink: 'Pink',
  blue: 'Blue',
}

const currentThemeLabel = computed(() => themeLabels[themeStore.theme])

function cycleTheme() {
  themeStore.cycle()
}

function switchLocale(newLocale: string) {
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
}

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
]
</script>

<template>
  <nav class="app-nav">
    <div class="nav-left">
      <RouterLink to="/" class="nav-brand">
        <img :src="erWretchFemale" class="nav-logo" alt="ER Save Viewer" />
        <span class="nav-title">{{ $t('appTitle') }}</span>
      </RouterLink>
      <RouterLink to="/about" class="nav-link">{{ $t('about') }}</RouterLink>
    </div>

    <div class="nav-right">
      <button class="nav-btn" @click="cycleTheme">
        <span class="btn-label">Theme</span>
        <span class="btn-value">{{ currentThemeLabel }}</span>
      </button>

      <select class="nav-select" :value="locale" @change="switchLocale(($event.target as HTMLSelectElement).value)">
        <option v-for="lang in languages" :key="lang.code" :value="lang.code">
          {{ lang.label }}
        </option>
      </select>
    </div>
  </nav>
</template>

<style scoped>
.app-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 1rem;
  background: var(--main-bg-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.nav-left {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.nav-logo {
  width: 2rem;
  height: 2rem;
  object-fit: cover;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.nav-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--highlight-color);
}

.nav-link {
  font-size: 0.85rem;
  color: var(--main-font-color);
  text-decoration: none;
  opacity: 0.7;
  transition: 0.2s;
}

.nav-link:hover {
  opacity: 1;
  color: var(--highlight-color);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.nav-btn {
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  background: var(--hover-background);
  color: var(--main-font-color);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.nav-btn:hover {
  border-color: var(--border-hover-color);
}

.btn-label {
  opacity: 0.6;
}

.btn-value {
  color: var(--highlight-color);
  font-weight: bold;
}

.nav-select {
  font-size: 0.75rem;
  padding: 0.3rem 0.4rem;
  background: var(--hover-background);
  color: var(--main-font-color);
  border: 1px solid var(--border-color);
  border-radius: 2px;
  cursor: pointer;
  outline: none;
}

.nav-select:focus {
  border-color: var(--highlight-color);
}
</style>
