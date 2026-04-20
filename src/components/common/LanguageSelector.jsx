// src/components/common/LanguageSelector.jsx — 언어 선택 컴포넌트 (shadcn Select 기반)
import { Globe } from '@phosphor-icons/react'
import { useI18n } from '@/hooks/useI18n'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

const LANGUAGES = {
  ko: { label: '한글',    flag: '🇰🇷' },
  en: { label: 'English', flag: '🇺🇸' },
}

export default function LanguageSelector() {
  const { language, setLanguage, getAvailableLanguages } = useI18n()
  const available = getAvailableLanguages()

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger
        size="sm"
        aria-label="언어 선택"
        className="gap-1.5"
      >
        <Globe size={14} className="text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {available.map((lang) => {
          const meta = LANGUAGES[lang]
          return (
            <SelectItem key={lang} value={lang} className="text-xs">
              <span className="mr-1">{meta?.flag}</span>
              {meta?.label ?? lang}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
