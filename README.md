# Vite + React + TypeScript with Tailwind and shadcn/ui

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Copy env example and adjust as needed:

```bash
cp .env.example .env
```

3. Run the dev server:

```bash
pnpm dev
```

4. Build for production:

```bash
pnpm build
```

5. Preview the production build:

```bash
pnpm preview
```

6. Run tests:

```bash
pnpm test
```

- Tailwind CSS and a minimal theme are configured in `tailwind.config.ts` and `src/styles/globals.css`.
- A shadcn-style `Button` is available at `src/lib/components/ui/button.tsx` and rendered on the homepage.

## Environment Variables

Create `.env` (see `.env.example`):

- `VITE_API_BASE` (default `/api`)
- `VITE_NETWORK_NAME` (default `Shape L2`)
- `VITE_BLOCK_POLL_INTERVAL` (default `10000` ms)
- `BLOCK_POLL_INTERVAL` (server poll interval ms)
- `SHAPE_RPC_URL` (default `https://mainnet.shape.network`)
- `OPENSEA_API_KEY` (optional; for future NFT adapters)

## Production (Vercel)

Deploy with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_ORG%2FYOUR_REPO&env=SHAPE_RPC_URL,BLOCK_POLL_INTERVAL,VITE_API_BASE,VITE_NETWORK_NAME,VITE_BLOCK_POLL_INTERVAL,OPENSEA_API_KEY)

- `vercel.json` routes `/api/*` to the Edge function (`api/[[...route]].ts`) and rewrites everything else to `index.html` for the SPA.
- Build command: `pnpm build`, output dir: `dist`.
- Set environment variables in Vercel Project Settings.

### Troubleshooting

- CORS: The server uses permissive CORS for `/api`; if you customize, ensure your frontend origin is allowed.
- Rate limits: A simple in-memory rate limiter (60 req/min/IP) is enabled. For production, consider a durable kv/store.
- RPC errors: Verify `SHAPE_RPC_URL` is reachable. Server retries requests twice with exponential backoff; client also retries network/5xx twice and shows a toast with retry info.
- NFT endpoints: If providers don’t support Shape L2 yet, the server returns a friendly TODO payload. See `server/adapters/nfts.ts` for next steps.

