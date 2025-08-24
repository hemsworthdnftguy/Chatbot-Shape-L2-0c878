# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project adheres to Semantic Versioning.

## [0.1.0] - 2025-01-23
### Added
- Vite + React + TypeScript app with Tailwind v4 and shadcn-style components
- Hono server with CORS, rate limiting, and Shape RPC-backed routes
- Tool system: balance, transaction, recent blocks, NFT (stubs), Shape Info
- Zustand store with persistence, Inspector, and chat UX (Enter/Shift+Enter)
- Axios client with retry/backoff and zod validation on client/server
- StatusBar polling health and block height
- Tests with Vitest + RTL and server integration
- Vercel deployment: Edge handler, SPA rewrites, env docs
- CI workflow: build and test with pnpm on Node 20

### Known issues / TODO
- NFT discovery requires Shape-compatible indexer or marketplace API; currently returns TODO payloads with suggested next steps
- Consider durable rate limiting and observability for production