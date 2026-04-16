// src/store/i18nStore.jsx — 국제화(i18n) 상태 관리
import { useState, useEffect } from 'react';
import { I18nContext } from './i18nContext';
import koTranslations from '@/locales/ko.json';
import enTranslations from '@/locales/en.json';

const translations = {
  ko: koTranslations,
  en: enTranslations,
};

const SUPPORTED_LANGUAGES = ['ko', 'en'];

// 중첩된 객체에서 키 경로로 값 가져오기
// 예: getNestedValue({ a: { b: 'value' } }, 'a.b') => 'value'
function getNestedValue(obj, path) {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === 'object') {
      current = current[key];
    } else {
      return path; // 경로를 찾을 수 없으면 원본 경로 반환
    }
  }
  return current || path;
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    // localStorage에서 저장된 언어 확인
    const saved = localStorage.getItem('language');
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      return saved;
    }
    // 시스템 언어 확인
    const systemLang = navigator.language?.split('-')[0];
    if (systemLang && SUPPORTED_LANGUAGES.includes(systemLang)) {
      return systemLang;
    }
    // 기본값: 한글
    return 'ko';
  });

  useEffect(() => {
    // 언어 변경 시 localStorage에 저장
    localStorage.setItem('language', language);
    // html 태그의 lang 속성 업데이트
    document.documentElement.lang = language;
  }, [language]);

  // 번역 함수
  const t = (path) => {
    if (!path) return '';
    const currentTranslations = translations[language];
    return getNestedValue(currentTranslations, path);
  };

  // 언어 변경 함수
  const setLanguage = (newLanguage) => {
    if (SUPPORTED_LANGUAGES.includes(newLanguage)) {
      setLanguageState(newLanguage);
    }
  };

  // 사용 가능한 언어 반환
  const getAvailableLanguages = () => SUPPORTED_LANGUAGES;

  const value = {
    language,
    setLanguage,
    t,
    getAvailableLanguages,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
