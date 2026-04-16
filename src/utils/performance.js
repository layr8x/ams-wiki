// src/utils/performance.js — 성능 최적화 유틸리티

// 페이지 성능 메트릭 수집
export const reportWebVitals = (metric) => {
  if (import.meta.env.VITE_ENABLE_ANALYTICS) {
    console.log('Performance Metric:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }
};

// 지연 로딩을 위한 Intersection Observer
export const observeLazyLoad = (element, callback, options = {}) => {
  if (!window.IntersectionObserver) {
    callback();
    return;
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      callback();
      observer.unobserve(entry.target);
    }
  }, {
    rootMargin: '50px',
    ...options
  });

  observer.observe(element);
};

// 번들 크기 분석 (개발 환경)
export const analyzeBundleSize = () => {
  if (import.meta.env.DEV) {
    const scripts = document.querySelectorAll('script[src]');
    const totalSize = Array.from(scripts).reduce((acc, script) => {
      return acc + (script.src ? script.src.length : 0);
    }, 0);
    console.log(`Total script size: ${(totalSize / 1024).toFixed(2)}KB`);
  }
};

// 이미지 최적화 - 크기별 제공
export const getOptimizedImageUrl = (url, width, height, format = 'webp') => {
  if (!url) return null;
  // 실제로는 CDN 또는 이미지 최적화 서비스 사용
  // 예: Cloudinary, ImageKit 등
  return url;
};

// 캐시 무효화 전략
export const getCacheKey = (key) => {
  const version = import.meta.env.VITE_APP_VERSION || '1.0.0';
  return `${key}-v${version}`;
};

// 성능 모니터링 래퍼
export const withPerformanceMonitoring = (asyncFn, label) => {
  return async (...args) => {
    const startTime = performance.now();
    try {
      const result = await asyncFn(...args);
      const duration = performance.now() - startTime;
      if (duration > 1000) {
        console.warn(`Slow operation [${label}]: ${duration.toFixed(2)}ms`);
      }
      return result;
    } catch (error) {
      console.error(`Error in [${label}]:`, error);
      throw error;
    }
  };
};
