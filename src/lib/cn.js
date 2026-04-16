/**
 * tailwind CSS 클래스 이름 병합 유틸리티
 * shadcn/ui에서 사용하는 클래스병합 함수
 */
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS와 shadcn/ui 호환 클래스명 병합
 *
 * @param {...any} inputs - 클래스 이름들
 * @returns {string} 병합된 클래스 문자열
 *
 * @example
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4'
 * cn('btn', { 'btn-active': isActive }) // 'btn btn-active'
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default cn
