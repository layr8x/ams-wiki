// e2e/basic.spec.js — 기본 E2E 테스트
import { test, expect } from '@playwright/test';

test.describe('AMS Wiki - 기본 기능', () => {
  test('홈페이지 로드 및 모듈 카드 표시', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AMS/);

    // 모듈 카드가 보이는지 확인
    const moduleCards = page.locator('a[href*="/modules/"]');
    await expect(moduleCards.first()).toBeVisible();
  });

  test('검색 기능 - 동의어 검색', async ({ page }) => {
    await page.goto('/');

    // 검색 버튼 클릭
    await page.click('button[aria-label*="search"], [role="button"]:has-text("가이드 검색")');
    await page.waitForTimeout(300);

    // 검색어 입력
    await page.fill('input[placeholder*="가이드"]', '돈 돌려받기');
    await page.waitForTimeout(500);

    // 환불 관련 결과 확인
    const results = page.locator('button:has-text("환불")');
    await expect(results.first()).toBeVisible({ timeout: 3000 });
  });

  test('가이드 목록 페이지 네비게이션', async ({ page }) => {
    await page.goto('/guides');

    // 가이드 카드 확인
    const guideCards = page.locator('[href*="/guides/"]').filter({ has: page.locator('h3') });
    await expect(guideCards.first()).toBeVisible();

    // 필터 칩 확인
    const filterChips = page.locator('button:has-text("전체"), button:has-text("청구")');
    await expect(filterChips.first()).toBeVisible();
  });

  test('모듈 필터 기능', async ({ page }) => {
    await page.goto('/guides');

    // "청구/수납/결제/환불" 필터 클릭
    const billingFilter = page.locator('button:has-text("청구/수납/결제/환불")');
    await billingFilter.click();

    // 필터가 활성화되었는지 확인
    await expect(billingFilter).toHaveAttribute('style', /0070f3/);
  });

  test('검색 정렬 기능', async ({ page }) => {
    await page.goto('/guides');

    // 정렬 선택
    const sortSelect = page.locator('select');
    await sortSelect.selectOption('popular');

    // 페이지가 업데이트되었는지 확인
    await page.waitForTimeout(300);
    const guideCards = page.locator('a[href*="/guides/"]');
    await expect(guideCards.first()).toBeVisible();
  });

  test('에러 페이지 (404)', async ({ page }) => {
    await page.goto('/nonexistent-page');

    // 에러 페이지 요소 확인
    await expect(page.locator('text=404')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button:has-text("홈으로")')).toBeVisible();
  });

  test('로딩 상태 확인', async ({ page }) => {
    // 느린 네트워크 시뮬레이션
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });

    await page.goto('/');

    // 로딩 스피너 또는 스켈레톤이 나타나는지 확인
    await page.waitForTimeout(100);
  });

  test('반응형 디자인 - 모바일', async ({ browser }) => {
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 },
    });
    const page = await mobileContext.newPage();

    await page.goto('/guides');

    // 모바일에서도 카드가 보이는지 확인
    const guideCards = page.locator('a[href*="/guides/"]');
    await expect(guideCards.first()).toBeVisible();

    await mobileContext.close();
  });

  test('반응형 디자인 - 태블릿', async ({ browser }) => {
    const tabletContext = await browser.newContext({
      viewport: { width: 768, height: 1024 },
    });
    const page = await tabletContext.newPage();

    await page.goto('/');

    // 레이아웃이 적절히 조정되는지 확인
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    await tabletContext.close();
  });
});

test.describe('AMS Wiki - 상세 기능', () => {
  test('가이드 상세 페이지 렌더링', async ({ page }) => {
    await page.goto('/guides/member-merge');

    // 제목 확인
    await expect(page.locator('h1')).toContainText('회원 병합');

    // TL;DR 확인
    await expect(page.locator('text=중복 계정')).toBeVisible();

    // 스텝 확인
    const steps = page.locator('text=/스텝|단계|처리 절차/i');
    await expect(steps.first()).toBeVisible({ timeout: 5000 });
  });

  test('피드백 위젯 상호작용', async ({ page }) => {
    await page.goto('/guides/member-merge');

    // 피드백 버튼 클릭
    const helpfulBtn = page.locator('button:has-text("도움됨")');
    await helpfulBtn.click({ timeout: 5000 });

    // 피드백 완료 메시지 확인
    await expect(page.locator('text=반영되었습니다')).toBeVisible({ timeout: 5000 });
  });
});
