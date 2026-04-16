// src/hooks/useI18n.js — 국제화(i18n) 훅
import { useContext } from 'react';
import { I18nContext } from '@/store/i18nContext';

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n은 I18nProvider 내에서만 사용할 수 있습니다.');
  }
  return context;
}

// 중첩된 키 경로로 번역 문자열 가져오기
export function useTranslation() {
  const { t } = useI18n();
  return t;
}

// 현재 언어 가져오기
export function useLanguage() {
  const { language } = useI18n();
  return language;
}

// 언어 변경 함수
export function useSetLanguage() {
  const { setLanguage } = useI18n();
  return setLanguage;
}
