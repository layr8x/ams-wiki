// src/store/__tests__/i18nStore.test.jsx
// I18nProvider + useI18n — 초기 언어, t() 경로 탐색, setLanguage 화이트리스트, html lang 반영
import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { I18nProvider } from '../i18nStore'
import { useI18n } from '@/hooks/useI18n'
import { STORAGE_KEYS } from '@/lib/storageKeys'

function Probe() {
  const { language, setLanguage, t, getAvailableLanguages } = useI18n()
  return (
    <div>
      <div data-testid="lang">{language}</div>
      <div data-testid="appName">{t('common.appName')}</div>
      <div data-testid="missing">{t('nonexistent.path')}</div>
      <div data-testid="available">{getAvailableLanguages().join(',')}</div>
      <button onClick={() => setLanguage('en')}>EN</button>
      <button onClick={() => setLanguage('fr')}>FR</button>
    </div>
  )
}

function renderProvider() {
  return render(
    <I18nProvider>
      <Probe />
    </I18nProvider>
  )
}

describe('I18nProvider', () => {
  let languageSpy

  beforeEach(() => {
    localStorage.clear()
    document.documentElement.lang = ''
  })

  afterEach(() => {
    if (languageSpy) languageSpy.mockRestore()
    languageSpy = null
  })

  it('저장된 언어가 있으면 그 값으로 초기화된다', () => {
    localStorage.setItem(STORAGE_KEYS.language, 'en')
    renderProvider()
    expect(screen.getByTestId('lang').textContent).toBe('en')
  })

  it('저장값이 없고 시스템 언어가 지원되지 않으면 ko 로 폴백', () => {
    languageSpy = vi.spyOn(navigator, 'language', 'get').mockReturnValue('fr-FR')
    renderProvider()
    expect(screen.getByTestId('lang').textContent).toBe('ko')
  })

  it('저장값이 없고 시스템 언어가 지원되면 그 값 사용', () => {
    languageSpy = vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US')
    renderProvider()
    expect(screen.getByTestId('lang').textContent).toBe('en')
  })

  it('저장값이 지원되지 않는 언어면 무시되고 시스템 언어가 사용된다', () => {
    localStorage.setItem(STORAGE_KEYS.language, 'fr')
    languageSpy = vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US')
    renderProvider()
    expect(screen.getByTestId('lang').textContent).toBe('en')
  })

  it('t() 는 점(.) 경로로 중첩 번역을 반환한다', () => {
    localStorage.setItem(STORAGE_KEYS.language, 'ko')
    renderProvider()
    expect(screen.getByTestId('appName').textContent).toBe('AMS Wiki')
  })

  it('경로가 존재하지 않으면 원본 경로 문자열을 그대로 반환', () => {
    renderProvider()
    expect(screen.getByTestId('missing').textContent).toBe('nonexistent.path')
  })

  it('setLanguage("en") 은 언어 전환 + localStorage 저장 + html lang 갱신', () => {
    localStorage.setItem(STORAGE_KEYS.language, 'ko')
    renderProvider()
    expect(screen.getByTestId('lang').textContent).toBe('ko')

    act(() => screen.getByText('EN').click())
    expect(screen.getByTestId('lang').textContent).toBe('en')
    expect(localStorage.getItem(STORAGE_KEYS.language)).toBe('en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('setLanguage 는 지원 언어 화이트리스트만 수용 (fr 무시)', () => {
    renderProvider()
    const before = screen.getByTestId('lang').textContent
    act(() => screen.getByText('FR').click())
    expect(screen.getByTestId('lang').textContent).toBe(before) // 변화 없음
  })

  it('getAvailableLanguages 는 ko,en 을 반환', () => {
    renderProvider()
    expect(screen.getByTestId('available').textContent).toBe('ko,en')
  })

  it('useI18n 를 Provider 밖에서 호출하면 에러', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Probe />)).toThrow(/I18nProvider/)
    spy.mockRestore()
  })
})
