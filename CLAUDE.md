# SGIP Frontend - Sistema de Gestión de Préstamos

## Build and Development Commands
- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Build application (Production check): `npm run build`
- Lint code: `npm run lint`

## Project Architecture & Tech Stack
- **Framework:** Next.js 14+ (Strictly using **App Router** inside `src/app/`).
- **Language:** TypeScript (Strictly typed, no implicit `any`).
- **Styling:** Tailwind CSS. Modern, minimalist, and clean FinTech look using standard utility classes and colored status badges.
- **State & Data Fetching:** Use native React hooks (`useState`, `useEffect`) and native `fetch` or `axios`. **DO NOT** install global state managers like Zustand or caching libraries like React Query unless explicitly requested.

## Code Style & Implementation Guidelines
- **Idempotency Requirement:** For state-changing operations (creating loans or mock payments), generate a UUID on the client side using `crypto.randomUUID()` and explicitly send it via the `X-Idempotency-Key` header.
- **Button Debouncing:** Disable submit buttons immediately upon click during loading states to mitigate double-submits.
- **Production-Ready Code:** Write complete code inside files. Avoid placeholders, partial snippets, or `// TODO` comments.
- **API URL:** Consume backend endpoints using the `process.env.NEXT_PUBLIC_API_URL` environment variable.

## Relations
- See `@AGENTS.md` and `agent.md` for strict framework rules.