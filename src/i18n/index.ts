import { createI18n } from 'vue-i18n'

import de from '@/i18n/de.ts'
import en from '@/i18n/en.ts'

export default createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') ? localStorage.getItem('locale')?.toLowerCase() : navigator.language != null ? navigator.language.split('-')[0] : 'en',
  fallbackLocale: 'en',
  messages: {
    de,
    en,
  },
})
