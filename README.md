# Shape L2 Chat – Vite + React + TypeScript

A modern chat-style starter for building AI/agent-powered apps on Shape L2. Includes a minimal Hono server, Tailwind + shadcn-styled UI, tool-style actions, typed client/server, and Vercel deployment.

## Overview

This project provides a batteries-included SPA shell and API gateway to help you prototype Shape L2 experiences quickly:
- Tailwind + shadcn/ui components and global theme
- Tool registry for common actions (balance, tx, blocks, NFTs stubs, Shape Info)
- Zod validation across server and client
- Axios client with retry/backoff and friendly error toasts
- Vite + React + TS with path aliases and Vitest + RTL
- Vercel-ready Edge handler for `/api/*` and SPA fallback

## Features

- Shape L2 health + block height status with periodic polling
- Tooling:
  - Balance by address
  - Transaction by hash (links to explorer)
  - Recent blocks
  - Search NFTs (Shape L2 adapters are stubs with clear TODOs)
  - What is Shape L2? (curated info + links)
- Chat input UX: Enter sends, Shift+Enter inserts newline
- Confirm modals for dangerous actions (Clear Chat) and tool prompts
- Inspector with collapsible result cards and Copy JSON
- Server responses fully zod-validated, with safe fallbacks

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS v4 + shadcn/ui primitives
- Zustand for app state + persistence
- Hono (Edge/Node) server with CORS and in-memory rate limiting
- Axios + zod on both client and server
- Vitest + React Testing Library
- Vercel Edge handler + vercel.json rewrites

## Quickstart

1) Install

```bash
pnpm install
```

2) Configure env

```bash
cp .env.example .env
# edit values as needed
```

3) Dev

```bash
pnpm dev
# starts server on 8787 (Hono) and Vite dev on 5173 with /api proxy
```

4) Build & preview

```bash
pnpm build
pnpm preview
```

5) Test

```bash
pnpm test
```

## Environment Variables

From `.env.example`:

- `VITE_API_BASE` (default `/api`)
- `VITE_NETWORK_NAME` (default `Shape L2`)
- `VITE_BLOCK_POLL_INTERVAL` (default `10000` ms; client)
- `BLOCK_POLL_INTERVAL` (default `10000` ms; server)
- `SHAPE_RPC_URL` (default `https://mainnet.shape.network`)
- `OPENSEA_API_KEY` (optional; future NFT adapters)

## Tools / Commands

Tools are exposed via the top toolbar and via free-text parsing.

- Balance: prompts for `address`
  - Example: `/balance 0x1234...`
  - Free-text: `balance 0x1234...` (asks for confirmation)
- Transaction: prompts for `hash`
  - Example: `/tx 0xabc...`
  - Result card links to the Shape explorer
- Recent Blocks: prompts for `limit` (default 10)
  - Example: `/blocks 5`
- Search NFTs: prompts for `query`, `mode` (collections/by-owner/by-collection), `limit`
  - Returns TODO guidance while Shape L2 sources are finalized
- What is Shape L2?: no inputs; immediately shows a curated FAQ with links

All tool inputs and server outputs are validated with zod.

## Deployment (Vercel)

One-click deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_ORG%2FYOUR_REPO&env=SHAPE_RPC_URL,BLOCK_POLL_INTERVAL,VITE_API_BASE,VITE_NETWORK_NAME,VITE_BLOCK_POLL_INTERVAL,OPENSEA_API_KEY)

- `vercel.json` rewrites `/api/(.*)` to Edge handler `api/[[...route]].ts` and all other routes to `index.html` for SPA
- Build command: `pnpm build`, output dir: `dist`
- Set Environment Variables under Vercel Project Settings

## Troubleshooting

- CORS: Defaults are permissive for `/api`. If customizing, ensure your frontend origin is allowed.
- Rate limits: In-memory 60 req/min/IP. For production use a durable KV/cache.
- RPC errors: Verify `SHAPE_RPC_URL` is reachable. Server retries twice on RPC, client retries twice on network/5xx and shows a toast with retry info.
- NFT endpoints: When no Shape-compatible source exists, the server returns a friendly TODO payload with next steps. See `server/adapters/nfts.ts`.
- Polling: Client polls health and block height using `VITE_BLOCK_POLL_INTERVAL` (clamped to 10–20s).

## Open Questions / TODO

- NFT Data Sources on Shape L2
  - Identify Shape-compatible indexer/marketplace for:
    - Collections search by slug or keywords
    - NFTs by owner address
    - NFTs by collection
  - Next steps:
    - Confirm official indexer availability or subgraph support
    - Implement adapters in `server/adapters/nfts.ts`
    - Add caching and pagination once sources are ready
- Additional Explorer Links
  - Confirm final Shape explorer base URL and add environment switch if needed
- Production Observability
  - Add logs/metrics and structured error reporting for server routes

---

Made with ❤️ for Shape L2 builders.

