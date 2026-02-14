import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import EnglishTranslations from './en'
import PortugueseTranslations from './pt'
import SpanishTranslations from './es'
import ChineseTranslations from './zh'
import JapaneseTranslations from './ja'

// Translations generated with gpt-4.1 and Claude Sonnet 4.5
// Please point out any inconsistency, error or improvements you may have
await i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: EnglishTranslations,
        },
        pt: {
            translation: PortugueseTranslations
        },
        zh: {
            translation: ChineseTranslations
        },
        ja: {
            translation: JapaneseTranslations
        },
        es: {
            translation: SpanishTranslations
        }
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;