import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export type Theme = 'dark' | 'pink' | 'blue'

export const useThemeStore = defineStore('theme', () => {
  const themes: Theme[] = ['dark', 'pink', 'blue']
  const theme = useStorage('pinia/theme', themes[0])
  addCSSClasses(theme.value as Theme)

  function cycle() {
    const currentIndex = themes.indexOf(theme.value as Theme)
    const nextIndex = (currentIndex + 1) % themes.length
    theme.value = themes[nextIndex]!
  }

  function set(newTheme: Theme) {
    theme.value = newTheme
  }

  function addCSSClasses(val: Theme) {
    document.documentElement.classList.remove('pink-theme', 'blue-theme')
    if (val !== 'dark') {
      document.documentElement.classList.add(`${val}-theme`)
    }
  }

  watch(theme, (val) => {
    addCSSClasses(val as Theme)
  })

  return { theme, themes, cycle, set }
})
