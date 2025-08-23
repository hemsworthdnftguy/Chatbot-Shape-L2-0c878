# Shape L2 Chatbot (Vite + React + TS)

Production-ready chat UI for Shape L2 with secure server API proxy.

## Quickstart

- Install deps: `npm i`
- Dev: `npm run dev` (starts server on 8787 and Vite on 5173)
- Test: `npm test`
- Build: `npm run build`

## Deployment

- Netlify: one-click using this repo. Netlify deploys `dist` and serves `/api/*` via a function.
- Env vars: put any API keys in provider-specific dashboard. No secrets in browser.

## Open Questions / TODO

- DESIRED_FUNCTIONS list is not provided. Using minimal intents (info, blocks, balance, NFTs).
- Replace `/api/blocks/head` with real Shape L2 endpoint per docs.
- Implement getBalance, getTransaction, listRecentBlocks, searchNFTs using Shape/OpenSea/Transient/Manifold depending on availability on Shape L2.
- Add richer status bar (network, version), and streaming responses if server supports.

