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

## Deploy

Click this to deploy:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https%3A%2F%2Fgithub.com%2Fhemsworthdnftguy%2Fchatbot-Shape-L2)

After deploy, set Environment Variables:
- `SHAPE_RPC_URL` = `https://mainnet.shape.network`
- `OPENSEA_API_KEY` = (optional; adds richer NFT data)

The `netlify.toml` config handles build output and routes `/api/*` to a serverless function wrapper for the Hono server.

