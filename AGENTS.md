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

Currently, there are no explicit linting or testing scripts in `package.json`. However, you should:

-   **Type Checking:** Use `pnpm astro check` (or `npx astro check` if the script isn't mapped) to verify TypeScript types.
-   **Linting:** Follow standard Astro/TypeScript linting practices. If adding linting, prefer ESLint with `eslint-plugin-astro`.
-   **Testing:** If adding tests, prefer Vitest as it integrates well with Vite/Astro. Place tests alongside components (e.g., `Component.test.ts`) or in a `tests/` directory.

### Running a Single Test

Since no test runner is configured, you cannot run a single test yet.
*If you add Vitest:*
`pnpm vitest run path/to/test/file.test.ts`

## 3. Project Structure

-   `src/pages/`: File-based routing. Files here become routes (e.g., `index.astro` -> `/`).
-   `src/components/`: Reusable UI components (e.g., `Welcome.astro`).
-   `src/layouts/`: Wrapper layouts for pages (e.g., `Layout.astro`).
-   `src/assets/`: Static assets like images and fonts.
-   `public/`: Static files served at the root.

## 4. Code Style & Conventions

### Formatting

-   **Indentation:** **Tabs** (based on existing files). Do not use spaces for indentation.
-   **Quotes:** Single quotes preferred for JS/TS imports and strings, double quotes for HTML attributes.
-   **Semicolons:** Always use semicolons.
-   **Trailing Commas:** ES5 trailing commas (objects, arrays, etc.).

### Naming Conventions

-   **Components:** PascalCase (e.g., `Welcome.astro`, `Card.tsx`).
-   **Files:**
    -   Components: PascalCase (`Welcome.astro`).
    -   Pages: kebab-case (`index.astro`, `about-us.astro`).
    -   Utilities/Scripts: camelCase or kebab-case (`utils.ts`, `api-client.ts`).
    -   Assets: kebab-case (`astro.svg`).
-   **Variables/Functions:** camelCase.
-   **Types/Interfaces:** PascalCase.

### TypeScript

-   **Strict Mode:** Enabled (via `tsconfig.json` extending `astro/tsconfigs/strict`).
-   **Types:** Explicitly define props interfaces for components.
    ```astro
    ---
    interface Props {
      title: string;
      body: string;
    }
    const { title, body } = Astro.props;
    ---
    ```
-   **Avoid `any`:** Use strict typing. Use `unknown` if the type is truly not known yet.

### Astro Specifics

-   **Frontmatter:** Use the `---` fence for component logic (imports, props, data fetching).
-   **Styles:** Use scoped `<style>` blocks within `.astro` files.
    -   Avoid global styles unless necessary (e.g., in `Layout.astro` or global CSS files).
    -   Use standard CSS (Astro supports it out of the box).
-   **Client Directives:** Use `client:*` directives sparingly, only when interactivity is needed (e.g., `client:load`, `client:visible`).

## 5. Error Handling

-   **Try/Catch:** Wrap async operations (data fetching) in `try/catch` blocks.
-   **UI Feedback:** Display user-friendly error messages if data loading fails.
-   **Logging:** Log errors to the console in development, but avoid exposing sensitive info in production.

## 6. Git & Version Control

-   **Commit Messages:** Use conventional commits (e.g., `feat: add new component`, `fix: resolve layout bug`).
-   **Atomic Commits:** Keep commits small and focused on a single task.

## 7. Adding New Features

1.  **Plan:** Understand the requirement.
2.  **Structure:** Decide where the new component or page belongs.
3.  **Implement:** Write the code following the style guide.
4.  **Verify:** Run `pnpm dev` to check functionality.
5.  **Type Check:** Run `pnpm astro check` to ensure no type errors.

## 8. Example Component Structure

```astro
---
// Imports
import SomeComponent from './SomeComponent.astro';

// Props Interface
interface Props {
	title: string;
	isActive?: boolean;
}

// Props Destructuring
const { title, isActive = false } = Astro.props;

// Logic/Data Fetching
const formattedTitle = title.toUpperCase();
---

<!-- Template -->
<div class:list={['container', { active: isActive }]}>
	<h1>{formattedTitle}</h1>
	<SomeComponent />
	<slot />
</div>

<!-- Scoped Styles -->
<style>
	.container {
		padding: 1rem;
		border: 1px solid #ccc;
	}
	.active {
		border-color: blue;
	}
</style>
```

## 9. Rules from Other Sources

*No `.cursor/rules`, `.cursorrules`, or `.github/copilot-instructions.md` found.*

## 10. Final Notes

-   **Performance:** Optimize images (use Astro's `<Image />` if possible).
-   **Accessibility:** Use semantic HTML elements (`<main>`, `<nav>`, `<article>`) and proper ARIA attributes.
-   **Refactoring:** When refactoring, ensure you don't break existing functionality. Check strictly typed props.

---
*Generated by OpenCode Agent*
