// src/components/common/LanguageSelector.jsx — 언어 선택 컴포넌트
import { Globe } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

export default function LanguageSelector() {
  const { language, setLanguage, getAvailableLanguages } = useI18n();

  const languages = {
    ko: { label: '한글', flag: '🇰🇷' },
    en: { label: 'English', flag: '🇺🇸' },
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px',
        background: 'var(--color-secondary)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--color-border)',
      }}
    >
      <Globe size={18} style={{ color: 'var(--color-muted-foreground)' }} />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          color: 'var(--color-foreground)',
          padding: '0 4px',
          fontFamily: 'inherit',
        }}
      >
        {getAvailableLanguages().map((lang) => (
          <option key={lang} value={lang}>
            {languages[lang]?.flag} {languages[lang]?.label}
          </option>
        ))}
      </select>
    </div>
  );
}
