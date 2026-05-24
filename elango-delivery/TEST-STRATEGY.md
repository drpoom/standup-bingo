# Elango Delivery — Test Strategy

> Scout 🔍 automated test plan. All tests < 1 min each. Priority-ordered.

---

## 1. Testing Philosophy

| Principle | Detail |
|---|---|
| **Shift left** | Write tests as soon as the feature exists (Phase 5 starts after Phase 1) |
| **Fast feedback** | Each test < 60s total (including setup) |
| **Deterministic** | No flaky tests; use `waitFor` with explicit state, not `sleep` |
| **Mobile-first** | All tests run in mobile viewport (375×667) by default |
| **Headless** | CI runs headless Chromium; local can use `--headed` for debugging |

---

## 2. Test Priority Tiers

### 🔴 Tier 1 — Critical Path (must always pass, blocks deploy)

| ID | Test | File | Timeout | Validates |
|---|---|---|---|---|
| T1-01 | App loads, canvas renders | `smoke.spec.ts` | 15s | Build is not broken |
| T1-02 | No console errors on load | `smoke.spec.ts` | 15s | Runtime health |
| T1-03 | Vehicle spawns and moves forward | `driving.spec.ts` | 30s | Core gameplay works |
| T1-04 | Vehicle turns left/right | `driving.spec.ts` | 20s | Steering works |
| T1-05 | Vehicle stops on no input | `driving.spec.ts` | 15s | Physics damping works |
| T1-06 | 60 FPS sustained for 5s | `performance.spec.ts` | 30s | Performance budget |

### 🟡 Tier 2 — Feature Integrity (should pass, blocks merge)

| ID | Test | File | Timeout | Validates |
|---|---|---|---|---|
| T2-01 | Touch joystick moves vehicle | `driving.spec.ts` | 20s | Mobile input |
| T2-02 | Camera follows vehicle | `driving.spec.ts` | 15s | Camera controller |
| T2-03 | Buildings render on map | `map.spec.ts` | 15s | Map integrity |
| T2-04 | Roads are traversable end-to-end | `map.spec.ts` | 30s | Road network |
| T2-05 | Woods border blocks vehicle | `map.spec.ts` | 15s | Boundary collision |
| T2-06 | Chickens scatter on horn | `interactions.spec.ts` | 20s | Chicken AI |
| T2-07 | Pedestrians dodge vehicle | `interactions.spec.ts` | 20s | Pedestrian AI |
| T2-08 | Traffic light cycles correctly | `interactions.spec.ts` | 15s | Traffic light FSM |
| T2-09 | Package pickup updates HUD | `interactions.spec.ts` | 15s | Delivery system |
| T2-10 | Delivery at mailbox scores point | `interactions.spec.ts` | 15s | Scoring system |

### 🟢 Tier 3 — Quality Assurance (nice to have, warns on fail)

| ID | Test | File | Timeout | Validates |
|---|---|---|---|---|
| T3-01 | No memory leak over 30s | `performance.spec.ts` | 45s | Memory budget |
| T3-02 | Bundle size < 500 KB gzipped | `performance.spec.ts` | 10s | Load performance |
| T3-03 | Touch targets ≥ 44px | `accessibility.spec.ts` | 10s | Mobile accessibility |
| T3-04 | ARIA labels on interactive elements | `accessibility.spec.ts` | 10s | Screen reader |
| T3-05 | BGM starts on user tap | `audio.spec.ts` | 15s | Audio policy |
| T3-06 | SFX plays on game events | `audio.spec.ts` | 15s | Sound effects |

---

## 3. Timeout Budget

| Phase | Max Time | Notes |
|---|---|---|
| **Browser launch** | 5s | Playwright startup |
| **Page load** | 10s | `waitForURL` + canvas check |
| **Game init** | 5s | Three.js scene ready |
| **Interaction** | 10s | `waitFor` state change |
| **Performance sample** | 5-30s | FPS/memory measurement window |
| **Total per test** | ≤ 60s | Hard cap |

### Playwright Config

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60000,           // 60s per test
  expect: { timeout: 10000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : '50%',
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'on-failure' }]],
  use: {
    baseURL: 'http://localhost:4173',  // Vite preview
    viewport: { width: 375, height: 667 },
    hasTouch: true,
    isMobile: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 4. Test Helpers & Utilities

### `tests/helpers/game.ts`

```typescript
import { Page, expect } from '@playwright/test';

// Wait for Three.js canvas to render at least one frame
export async function waitForGameReady(page: Page) {
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForFunction(() => {
    const canvas = document.querySelector('canvas');
    return canvas && canvas.width > 0 && canvas.height > 0;
  }, { timeout: 10000 });
}

// Simulate touch joystick (drag from center)
export async function dragJoystick(page: Page, direction: 'forward' | 'back' | 'left' | 'right', duration = 500) {
  const joystick = page.locator('[data-testid="joystick"]');
  const box = await joystick.boundingBox();
  if (!box) throw new Error('Joystick not found');
  
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const offset = 30;
  
  const moves = {
    forward: { x: cx, y: cy - offset },
    back: { x: cx, y: cy + offset },
    left: { x: cx - offset, y: cy },
    right: { x: cx + offset, y: cy },
  };
  
  const target = moves[direction];
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(target.x, target.y, { steps: 5 });
  await page.waitForTimeout(duration);
  await page.mouse.up();
}

// Measure FPS via requestAnimationFrame
export async function measureFPS(page: Page, durationMs = 5000): Promise<number> {
  return page.evaluate(async (ms) => {
    return new Promise<number>((resolve) => {
      let frames = 0;
      const start = performance.now();
      function tick() {
        frames++;
        if (performance.now() - start >= ms) {
          resolve((frames / ms) * 1000);
        } else {
          requestAnimationFrame(tick);
        }
      }
      requestAnimationFrame(tick);
    });
  }, durationMs);
}

// Tap a UI button by test ID
export async function tapButton(page: Page, testId: string) {
  await page.locator(`[data-testid="${testId}"]`).tap();
}
```

---

## 5. Test Execution Order

Tests run in parallel by default (Playwright default). For CI stability:

1. **Tier 1** tests run first (critical path)
2. **Tier 2** tests run in parallel after Tier 1
3. **Tier 3** tests run last (non-blocking)

Configure with Playwright projects:

```typescript
// In playwright.config.ts projects array:
[
  { name: 'tier1', testDir: './tests/e2e', grep: /@tier1/, retries: 2 },
  { name: 'tier2', testDir: './tests/e2e', grep: /@tier2/, retries: 1 },
  { name: 'tier3', testDir: './tests/e2e', grep: /@tier3/ },
]
```

Tag tests with `@tier1`, `@tier2`, `@tier3` in describe blocks:

```typescript
test.describe('Driving @tier1', () => { ... });
test.describe('Interactions @tier2', () => { ... });
test.describe('Accessibility @tier3', () => { ... });
```

---

## 6. Failure Handling Protocol

When a test fails:

```
1. Scout reports failure with:
   - Test name + file
   - Stack trace
   - Screenshot (auto-captured)
   - Console errors (if any)
   - Video (on retry failure)

2. Archie triages:
   - Root cause: code bug? test bug? flaky? env issue?
   - Assign to Byte if code fix needed
   - Assign to Scout if test needs update

3. Byte fixes:
   - Minimal targeted change
   - No refactoring unless related

4. Scout retests:
   - Run affected test suite only
   - Then run full suite to catch regressions

5. All green → proceed
```

### Flaky Test Policy

- A test that fails intermittently gets `@flaky` tag
- Flaky tests are excluded from CI gate (but still reported)
- After 3 consecutive flaky failures → Archie must fix or rewrite the test
- **Never delete a test** without Archie's approval

---

## 7. Performance Test Details

### FPS Test (T1-06)

```typescript
test('sustains 60 FPS for 5 seconds of driving', async ({ page }) => {
  await waitForGameReady(page);
  await dragJoystick(page, 'forward', 5000);
  const fps = await measureFPS(page, 5000);
  expect(fps).toBeGreaterThanOrEqual(55); // Allow 5 FPS margin
});
```

### Memory Leak Test (T3-01)

```typescript
test('no memory leak over 30 seconds', async ({ page }) => {
  await waitForGameReady(page);
  
  const getHeap = () => page.evaluate(() => 
    (performance as any).memory?.usedJSHeapSize ?? 0
  );
  
  const startHeap = await getHeap();
  await dragJoystick(page, 'forward', 15000);
  await page.waitForTimeout(1000); // GC settle
  const endHeap = await getHeap();
  
  const growth = endHeap - startHeap;
  expect(growth).toBeLessThan(5 * 1024 * 1024); // < 5 MB
});
```

---

## 8. Mobile-Specific Test Considerations

| Concern | Solution |
|---|---|
| Touch events | Use `page.mouse` with touch simulation (`hasTouch: true`) |
| Viewport | Fixed 375×667 (iPhone SE) |
| Audio autoplay | Test that BGM requires tap to start |
| Keyboard fallback | Run subset of tests with desktop viewport |
| Device pixel ratio | Test with DPR 2 and 3 |
| Network throttle | Optional: `page.route` to simulate slow 3G for load tests |

---

*Last updated: 2026-05-24*