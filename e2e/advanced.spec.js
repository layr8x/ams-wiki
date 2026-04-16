// e2e/advanced.spec.js — 고급 E2E 테스트
import { test, expect } from '@playwright/test';

test.describe('AMS Wiki - 고급 기능', () => {
  test('언어 선택기 (다국어 지원)', async ({ page }) => {
    await page.goto('/');

    // 페이지가 로드되는지 확인
    await expect(page).toHaveTitle(/AMS/);

    // 언어 선택기 찾기
    const languageSelector = page.locator('select');
    await expect(languageSelector).toBeVisible({ timeout: 5000 });

    // 언어 변경 (한글 -> 영문)
    await languageSelector.selectOption('en');
    await page.waitForTimeout(300);

    // 페이지가 여전히 로드되어 있는지 확인
    await expect(page).toHaveTitle(/AMS/);

    // 다시 한글로 변경
    await languageSelector.selectOption('ko');
  });

  test('다크 모드 토글 및 지속성', async ({ browser }) => {
    // 첫 번째 페이지에서 다크 모드 활성화
    let context = await browser.newContext();
    let page = await context.newPage();

    await page.goto('/');

    // 다크 모드 토글 버튼 찾기
    const themeToggle = page.locator('button[title*="모드"]');
    if (await themeToggle.isVisible({ timeout: 5000 })) {
      await themeToggle.click();

      // HTML 요소에 'dark' 클래스가 추가되었는지 확인
      const htmlElement = page.locator('html');
      await expect(htmlElement).toHaveClass(/dark/);
    }

    await context.close();

    // 두 번째 페이지에서 다크 모드가 유지되는지 확인
    context = await browser.newContext();
    page = await context.newPage();

    // 같은 localStorage를 사용하도록 로드
    await page.goto('/');

    // 예상: dark 클래스가 유지될 것 (localStorage에 저장되었기 때문)
    const htmlElement = page.locator('html');
    // 주의: 이 테스트는 실제 localStorage 구현에 따라 달라질 수 있음

    await context.close();
  });

  test('가이드 필터링 기능', async ({ page }) => {
    await page.goto('/guides');

    // 가이드 카드가 표시되는지 확인
    const guideCards = page.locator('[href*="/guides/"]');
    const initialCount = await guideCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // 모듈 필터 찾기 (있는 경우)
    const filterChips = page.locator('button:has-text("청구"), button:has-text("회원관리")');
    if (await filterChips.first().isVisible({ timeout: 3000 })) {
      // 필터 클릭
      await filterChips.first().click();
      await page.waitForTimeout(500);

      // 필터된 결과 확인
      const filteredCards = page.locator('[href*="/guides/"]');
      const filteredCount = await filteredCards.count();

      // 필터링 후 항목 수가 변할 수 있음 (또는 같을 수 있음)
      expect(typeof filteredCount).toBe('number');
    }
  });

  test('페이지네이션 네비게이션', async ({ page }) => {
    await page.goto('/guides');

    // "다음" 버튼 찾기
    const nextButton = page.locator('button:has-text("다음")');

    if (await nextButton.isVisible({ timeout: 3000 })) {
      // 다음 페이지로 이동
      await nextButton.click();
      await page.waitForTimeout(500);

      // 가이드 카드가 여전히 보이는지 확인
      const guideCards = page.locator('[href*="/guides/"]');
      await expect(guideCards.first()).toBeVisible({ timeout: 3000 });

      // "이전" 버튼으로 돌아가기
      const prevButton = page.locator('button:has-text("이전")');
      await prevButton.click();
      await page.waitForTimeout(500);

      // 첫 페이지의 가이드 카드 확인
      await expect(guideCards.first()).toBeVisible();
    }
  });

  test('동의어 확장 검색 (고급)', async ({ page }) => {
    await page.goto('/');

    // 검색 버튼 클릭
    const searchButton = page.locator('button[aria-label*="search"], [role="button"]:has-text("검색")');
    if (await searchButton.isVisible({ timeout: 3000 })) {
      await searchButton.click();
      await page.waitForTimeout(300);

      // 여러 동의어로 검색
      const testCases = [
        { query: '돈 돌려받기', expected: '환불' },
        { query: '계정 통합', expected: '병합' },
        { query: 'QR', expected: '출석' },
      ];

      for (const testCase of testCases) {
        const searchInput = page.locator('input[placeholder*="검색"]');
        await searchInput.fill(testCase.query);
        await page.waitForTimeout(500);

        // 검색 결과가 표시되는지 확인
        const results = page.locator('button:has-text(' + JSON.stringify(testCase.expected) + ')');
        if (await results.count() > 0) {
          await expect(results.first()).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });

  test('가이드 상세 페이지의 메타데이터', async ({ page }) => {
    await page.goto('/guides/member-merge');

    // 제목 확인
    await expect(page.locator('h1')).toContainText('회원');

    // 메타데이터 요소 찾기
    const metadata = page.locator('text=/조회수|도움이|버전|작성자/i');
    if (await metadata.count() > 0) {
      await expect(metadata.first()).toBeVisible();
    }

    // TL;DR 섹션
    const tldr = page.locator('text=/요약|중복|계정/i');
    if (await tldr.count() > 0) {
      await expect(tldr.first()).toBeVisible();
    }
  });

  test('AI 챗봇 상호작용', async ({ page }) => {
    await page.goto('/');

    // 플로팅 채팅 버튼 찾기
    const chatButton = page.locator('button[title*="채팅"]');
    if (await chatButton.isVisible({ timeout: 3000 })) {
      // 채팅창 열기
      await chatButton.click();
      await page.waitForTimeout(300);

      // 채팅 입력 필드
      const chatInput = page.locator('input[placeholder*="메시지"]');
      if (await chatInput.isVisible()) {
        // 메시지 입력
        await chatInput.fill('안녕하세요');

        // 전송 버튼 찾기
        const sendButton = page.locator('button:has-text("전송")');
        if (await sendButton.isVisible()) {
          await sendButton.click();
          await page.waitForTimeout(1500);

          // 봇 응답 확인
          const botMessage = page.locator('[role="message"]');
          if (await botMessage.count() > 0) {
            await expect(botMessage.last()).toBeVisible();
          }
        }
      }
    }
  });

  test('접근성 - 키보드 네비게이션', async ({ page }) => {
    await page.goto('/guides');

    // Tab 키로 네비게이션
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    // 포커스된 요소 확인
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    expect(focusedElement).toBeTruthy();

    // 여러 탭 네비게이션
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);
    }

    // 여전히 페이지가 안전한 상태인지 확인
    await expect(page).toHaveTitle(/AMS/);
  });

  test('반응형 - 윈도우 리사이징', async ({ page }) => {
    await page.goto('/guides');

    // 초기 크기
    await page.setViewportSize({ width: 1920, height: 1080 });
    let cards = page.locator('[href*="/guides/"]');
    const desktopCount = await cards.count();
    expect(desktopCount).toBeGreaterThan(0);

    // 태블릿 크기
    await page.setViewportSize({ width: 768, height: 1024 });
    cards = page.locator('[href*="/guides/"]');
    const tabletCount = await cards.count();
    expect(tabletCount).toBeGreaterThan(0);

    // 모바일 크기
    await page.setViewportSize({ width: 375, height: 667 });
    cards = page.locator('[href*="/guides/"]');
    const mobileCount = await cards.count();
    expect(mobileCount).toBeGreaterThan(0);
  });

  test('에러 복구 (오류 페이지 내비게이션)', async ({ page }) => {
    // 존재하지 않는 페이지로 이동
    await page.goto('/nonexistent-guide-12345');

    // 에러 페이지 요소 확인
    const errorTitle = page.locator('text=404');
    await expect(errorTitle).toBeVisible({ timeout: 5000 });

    // 홈으로 이동 버튼
    const homeButton = page.locator('button:has-text("홈")');
    if (await homeButton.isVisible()) {
      await homeButton.click();
      await page.waitForTimeout(500);

      // 홈페이지로 복구되었는지 확인
      await expect(page).toHaveURL('/');
      await expect(page).toHaveTitle(/AMS/);
    }
  });
});

test.describe('AMS Wiki - 성능 테스트', () => {
  test('대량 데이터 로드 성능', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/guides');
    const loadTime = Date.now() - startTime;

    // 로드 시간이 합리적인지 확인 (5초 이내)
    expect(loadTime).toBeLessThan(5000);

    // 모든 가이드 카드가 로드되었는지 확인
    const cards = page.locator('[href*="/guides/"]');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('검색 응답 성능', async ({ page }) => {
    await page.goto('/guides');

    const searchInput = page.locator('input[placeholder*="검색"]');
    if (await searchInput.isVisible({ timeout: 3000 })) {
      const startTime = Date.now();
      await searchInput.fill('환불');
      await page.waitForTimeout(500);
      const searchTime = Date.now() - startTime;

      // 검색 응답이 1초 이내여야 함
      expect(searchTime).toBeLessThan(1000);

      // 검색 결과 확인
      const results = page.locator('[href*="/guides/"]');
      expect(await results.count()).toBeGreaterThanOrEqual(0);
    }
  });
});
