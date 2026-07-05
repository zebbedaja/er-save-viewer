<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { onClickOutside } from '@vueuse/core'
import { useThemeStore, type Theme } from '@/stores/theme'
import { useSpoilerStore } from '@/stores/spoiler'
import { useTrackChangesStore } from '@/stores/trackChanges'
import faviconSvg from '@/assets/img/favicon.svg'

const { locale, t } = useI18n()
const themeStore = useThemeStore()
const spoilerStore = useSpoilerStore()
const trackChangesStore = useTrackChangesStore()

const isMenuOpen = ref(false)
const navWrapperRef = ref<HTMLElement | null>(null)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

onClickOutside(navWrapperRef, closeMenu)

const themeKeys: Record<Theme, string> = {
  dark: 'themeDark',
  light: 'themeLight',
  pink: 'themePink',
  blue: 'themeBlue',
}

const currentThemeLabel = computed(() => t(themeKeys[themeStore.theme ?? 'dark']))

function cycleTheme() {
  themeStore.cycle()
}

function switchLocale(newLocale: string) {
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
]
</script>

<template>
  <div class="nav-wrapper" ref="navWrapperRef">
    <nav class="app-nav">
      <div class="nav-left">
        <RouterLink to="/" class="nav-brand">
          <img :src="faviconSvg" class="nav-logo" :alt="$t('appTitle')" />
          <span class="nav-title">{{ $t('appTitle') }}</span>
        </RouterLink>
        <RouterLink to="/about" class="nav-link">{{ $t('about') }}</RouterLink>
      </div>

      <button class="nav-hamburger" @click="toggleMenu">
        <svg
          v-if="!isMenuOpen"
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div class="nav-right" :class="{ open: isMenuOpen }">
        <RouterLink to="/about" class="nav-link" @click="closeMenu">
          {{ $t('about') }}
        </RouterLink>

        <button class="nav-btn" @click="cycleTheme">
          <span class="btn-label">{{ $t('theme') }}</span>
          <span class="btn-value">{{ currentThemeLabel }}</span>
        </button>

        <button class="nav-btn" @click="spoilerStore.toggle">
          <span class="btn-label">{{ $t('spoiler') }}</span>
          <span class="btn-value" :class="{ 'spoiler-active': spoilerStore.spoilerMode }">
            {{ spoilerStore.spoilerMode ? $t('spoilerOn') : $t('spoilerOff') }}
          </span>
        </button>

        <button class="nav-btn" @click="trackChangesStore.toggle">
          <span class="btn-label">{{ $t('trackChanges') }}</span>
          <span class="btn-value" :class="{ 'track-active': trackChangesStore.trackChangesMode }">
            {{ trackChangesStore.trackChangesMode ? $t('trackChangesOn') : $t('trackChangesOff') }}
          </span>
        </button>

        <select class="nav-select" :value="locale" @change="switchLocale(($event.target as HTMLSelectElement).value)">
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.label }}
          </option>
        </select>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.nav-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.app-nav {
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

.nav-right .nav-link {
  display: none;
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

.btn-value.spoiler-active {
  color: #e74c3c;
}

.btn-value.track-active {
  color: #4ade80;
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

.nav-hamburger {
  display: none;
  flex-shrink: 0;
  padding: 0.3rem;
  background: transparent;
  color: var(--main-font-color);
  border: none;
  cursor: pointer;
}

.nav-hamburger:hover {
  color: var(--highlight-color);
}

@media (max-width: 768px) {
  .nav-hamburger {
    display: block;
  }

  .nav-link {
    display: none;
  }

  .nav-right {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 0.4rem;
    padding: 0.8rem 1rem;
    background: var(--main-bg-color);
    border-bottom: 1px solid var(--border-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .nav-right.open {
    display: flex;
  }

  .nav-right .nav-link {
    display: block;
    padding: 0.4rem 0.6rem;
    border-radius: 2px;
  }

  .nav-right .nav-link:hover {
    background: var(--hover-background);
  }

  .nav-right .nav-btn {
    justify-content: flex-start;
  }

  .nav-right .nav-select {
    align-self: flex-start;
    width: auto;
  }
}
</style>
