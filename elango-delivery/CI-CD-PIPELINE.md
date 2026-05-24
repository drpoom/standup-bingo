# Elango Delivery — CI/CD Pipeline Design

> GitHub Actions workflow for automated testing + deploy on tag.

---

## Pipeline Overview

```
Push/PR ──→ CI Pipeline ──→ (all green?) ──→ merge allowed
                                        │
Tag v*  ──→ Deploy Pipeline ──→ build ──→ deploy to GitHub Pages
```

---

## 1. CI Pipeline — `.github/workflows/ci.yml`

**Triggers:** `push` to any branch, `pull_request` to `main`

```yaml
name: CI

on:
  push:
    branches: ['*']
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  build:
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-results
          path: |
            test-results/
            playwright-report/

  bundle-size:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - name: Check bundle size
        run: |
          TOTAL=$(du -sb dist/ | cut -f1)
          GZIPPED=$(find dist/ -name '*.js' -o -name '*.css' | xargs gzip -c | wc -c)
          echo "Total bundle: $TOTAL bytes"
          echo "Gzipped JS+CSS: $GZIPPED bytes"
          # Fail if gzipped JS+CSS exceeds 500 KB
          if [ "$GZIPPED" -gt 512000 ]; then
            echo "❌ Bundle too large: $GZIPPED bytes (limit: 512000)"
            exit 1
          fi
          echo "✅ Bundle size OK"
```

### CI Pipeline Characteristics

| Aspect | Value |
|---|---|
| **Node version** | 22 |
| **Total jobs** | 4 (lint+typecheck → build → test → bundle-size) |
| **Max runtime** | ~5 min |
| **Failure policy** | Any job fail → PR cannot merge |
| **Artifacts** | `dist/` on success; `test-results/` on failure |

---

## 2. Deploy Pipeline — `.github/workflows/deploy.yml`

**Triggers:** Tag push matching `v*` (e.g., `v0.0.1`, `v0.1.0`)

```yaml
name: Deploy

on:
  push:
    tags:
      - 'v*'

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npm test

      # Deploy to GitHub Pages
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/
      - id: deployment
        uses: actions/deploy-pages@v4

      # Create GitHub Release
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          generate_release_notes: true
          body: |
            ## Elango Delivery ${{ github.ref_name }}

            ### Deployment
            - **URL**: ${{ steps.deployment.outputs.page_url }}
            - **Commit**: ${{ github.sha }}

            ### Play
            Open the URL above on a mobile browser for the best experience.
```

### Deploy Pipeline Characteristics

| Aspect | Value |
|---|---|
| **Trigger** | Tag `v*` push only |
| **Pre-deploy checks** | Lint + typecheck + build + full test suite |
| **Deploy target** | GitHub Pages (static) |
| **Release** | Auto-created with release notes |
| **Rollback** | Re-tag previous commit, re-push tag |

---

## 3. Branch Protection Rules

Configure in GitHub repo Settings → Branches:

| Rule | Value |
|---|---|
| **Branch** | `main` |
| **Require PR** | ✅ |
| **Require approvals** | 1 (or self-merge for solo dev) |
| **Require status checks** | ✅ All CI jobs must pass |
| **Require linear history** | ✅ (squash merge) |
| **Allow force pushes** | ❌ |

---

## 4. NPM Scripts Reference

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.vue",
    "lint:fix": "eslint . --ext .ts,.vue --fix",
    "typecheck": "vue-tsc --noEmit",
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug"
  }
}
```

---

## 5. Vite Build Configuration for GitHub Pages

In `vite.config.ts`:

```typescript
export default defineConfig({
  base: process.env.GITHUB_PAGES
    ? '/elango-delivery/'
    : '/',
  plugins: [
    vue(),
    tailwindcss(),
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          physics: ['cannon-es'],
          vue: ['vue'],
        },
      },
    },
  },
});
```

---

## 6. Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `GITHUB_PAGES` | CI/CD | Set to `true` for GitHub Pages base path |
| `VITE_GAME_VERSION` | Build | Injected from `package.json` version |

---

*Last updated: 2026-05-24*