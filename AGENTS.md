# AGENTS.md

This document provides instructions and guidelines for AI agents working in this repository. Please adhere to these rules strictly to maintain consistency and quality.

## 1. Environment & Setup

- **Language:** TypeScript, HTML, CSS (Astro)
- **Framework:** [Astro](https://astro.build/)
- **Package Manager:** [pnpm](https://pnpm.io/)
- **Node Version:** LTS (implied, ensure compatibility with Astro ^5.17.1)

## 2. Build & Development Commands

Use `pnpm` for all script executions.

### Core Commands

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the local development server (Astro). |
| `pnpm build` | Builds the production site to `./dist`. |
| `pnpm preview` | Previews the production build locally. |
| `pnpm astro` | Runs the Astro CLI directly (e.g., `pnpm astro add`, `pnpm astro check`). |

### Linting & Testing

-   **Type Checking:** Use `pnpm astro check` (or `npx astro check`) to verify TypeScript types.
-   **Linting:** Follow standard Astro/TypeScript linting practices.
-   **Testing:** Currently manual verification.

## 3. Architecture & Core Constraints

**CRITICAL:** This project is a collection of client-side tools with **NO backend, NO cookies, and NO local storage**.

### URL-Based State
All application state must be persisted in the URL query parameters. This allows users to save/share their state by simply bookmarking or sharing the link.

-   **Library:** Use `src/lib/url-store.ts` for all state management.
-   **Usage:**
    ```typescript
    import { URLStore } from '../lib/url-store';
    
    // Initialize with default value
    const store = new URLStore<string>('default');
    
    // Read
    const val = store.get();
    
    // Write (automatically updates URL)
    store.set('newValue');
    
    // Subscribe (updates on back/forward navigation)
    store.subscribe((val) => { console.log(val); });
    ```

## 4. Project Structure

-   `src/pages/`: Contains the tools. Each file (e.g., `clock.astro`) is a standalone tool.
-   `src/lib/`: Shared utilities (e.g., `url-store.ts`).
-   `src/layouts/`: Wrapper layouts (e.g., `Layout.astro`).
-   `src/components/`: Reusable UI components.

## 5. Code Style & Conventions

### Formatting
-   **Indentation:** **Tabs**.
-   **Quotes:** Single quotes for JS/TS, double for HTML.
-   **Semicolons:** Always.

### Tool Design Guidelines
-   **Focus:** Each tool should do **one thing** well.
-   **Visuals:** Tools should be **distraction-free**. Use the full viewport (`100vh`/`100vw`) where appropriate. Avoid clutter.
-   **Dark Mode:** All tools **must** support dark mode (via `@media (prefers-color-scheme: dark)`).
-   **Responsiveness:** Must work on mobile and desktop.

### TypeScript
-   **Strict Mode:** Enabled.
-   **No `any`:** Use strict typing.

## 6. Adding New Features/Tools

1.  **Plan:** Identify the single purpose of the tool.
2.  **Create:** Add a new `.astro` file in `src/pages/`.
3.  **State:** Implement `URLStore` for any data that needs to persist.
4.  **Register:** Add the tool to the list in `src/pages/index.astro`.
5.  **Verify:** Check functionality, URL persistence, and dark mode.

## 7. Example Component Structure

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout title="Tool Name">
    <div class="container">
        <!-- Tool UI -->
    </div>
</Layout>

<script>
    import { URLStore } from '../lib/url-store';
    // Logic here
</script>

<style>
    /* Scoped CSS */
</style>
```

## 8. Final Notes

-   **Performance:** Keep bundles small.
-   **Accessibility:** Use semantic HTML.
-   **Refactoring:** Ensure you don't break existing URL state compatibility if possible.
