import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhCNLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import elementZhTWLocale from 'element-ui/lib/locale/lang/zh-TW'// element-ui lang
import enLocale from './en-US'
import zhCNLocale from './zh-CN'
import esTWLocale from './zh-TW'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  'zh-CN': {
    ...zhCNLocale,
    ...elementZhCNLocale
  },
  'zh-TW': {
    ...esTWLocale,
    ...elementZhTWLocale
  }
}
export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage)
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'en'
}
const i18n = new VueI18n({
  // options: en | zh | es
  locale: getLanguage(),
  // set locale messages
  messages
})

export default i18n
