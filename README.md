# Trinidad Wiseman Homework

A React single-page application bootstrapped with Vite and TypeScript. The project pairs Ant Design UI components with React Query-driven data fetching and includes tooling for unit tests, end-to-end tests, and linting.

## Tech Stack

- **Framework:** [React 19](https://react.dev/) with [React Router](https://reactrouter.com/) for routing
- **Build tooling:** [Vite](https://vitejs.dev/) with TypeScript and vite-tsconfig-paths
- **UI library:** [Ant Design](https://ant.design/) and Ant Design Icons
- **Data fetching:** [Axios](https://axios-http.com/) with [TanStack Query](https://tanstack.com/query/latest)
- **Testing:** [Vitest](https://vitest.dev/) with Testing Library, plus [Playwright](https://playwright.dev/) for end-to-end coverage
- **Code quality:** ESLint (TypeScript + React rules) and Prettier

## Prerequisites

- **Node.js** 18 or newer (LTS recommended)
- **npm** 9 or newer (ships with Node.js installs)

You can confirm your versions with:

```bash
node --version
npm --version
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the development server**
   ```bash
   npm run dev
   ```
   The Vite dev server runs on [http://localhost:5173](http://localhost:5173) by default.
3. *(Optional)* **Start the mock API** used during development
   ```bash
   npm run mock
   ```
   The mock server listens on port `8888`. You can run it alongside the Vite dev server in a separate terminal.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module reloading. |
| `npm run mock` | Launch the local mock API server on port 8888. |
| `npm run build` | Type-check the project and generate a production build. |
| `npm run preview` | Preview the production build locally after running `npm run build`. |
| `npm run lint` | Run ESLint across the codebase. |
| `npm run e2e` | Execute Playwright end-to-end test suites. |

## Running Tests

### Unit and Component Tests (Vitest)

Vitest is configured via `vitest.setup.ts`. You can run the test watcher or a single run:

```bash
npx vitest
# or for a single run
npx vitest run
```

### End-to-End Tests (Playwright)

To run the browser tests:

```bash
npm run e2e
```

Playwright will automatically install required browsers on the first execution.

### Linting

Ensure code style and quality checks pass before committing:

```bash
npm run lint
```

## Project Structure Highlights

- `src/` – Application source code (components, hooks, routes, and styles)
- `public/` – Static assets copied as-is to the build output
- `mock.server.js` – Express-based mock API used during local development
- `playwright.config.ts` – Configuration for Playwright E2E tests

## Additional Resources

- [Vite documentation](https://vitejs.dev/guide/)
- [Ant Design documentation](https://ant.design/components/overview/)
- [TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Playwright documentation](https://playwright.dev/docs/intro)

