// src/utils/__tests__/utils.test.js — 유틸리티 함수 테스트
import { describe, it, expect } from 'vitest';
import { getCacheKey, getOptimizedImageUrl } from '../performance';

describe('Performance Utils', () => {
  describe('getCacheKey', () => {
    it('should return cache key with version', () => {
      const key = getCacheKey('guides');
      expect(key).toBeTruthy();
      expect(key).toContain('guides');
      expect(key).toContain('v');
    });

    it('should use consistent version for same key', () => {
      const key1 = getCacheKey('guides');
      const key2 = getCacheKey('guides');
      expect(key1).toBe(key2);
    });
  });

  describe('getOptimizedImageUrl', () => {
    it('should return null for empty url', () => {
      expect(getOptimizedImageUrl(null)).toBeNull();
      expect(getOptimizedImageUrl('')).toBeNull();
    });

    it('should return url for valid input', () => {
      const url = 'https://example.com/image.jpg';
      expect(getOptimizedImageUrl(url, 800, 600)).toBe(url);
    });
  });
});
