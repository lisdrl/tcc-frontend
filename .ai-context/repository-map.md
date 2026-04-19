# Repository Map

## Top-Level Directories

- `version-0/`
  - Version 0 baseline.
  - React + TypeScript + Vite application.
  - Chat is tightly coupled to Sendbird SDK and Sendbird UIKit.
- `version-1/`
  - Currently a copy of `version-0`.
  - Intended target for the first decoupling approach.
- `.devcontainer/`
  - Development container configuration.
- `.ai-context/`
  - Context for AI tools working on the repository.

## Version 0 Application Structure

Important folders inside `version-0/src`:

- `App.tsx`
  - App-level provider setup.
- `pages/Home/`
  - Main OMS page.
- `components/Header/`
  - Page header and chat-list entry point.
- `components/UnreadBadge/`
  - Shared unread badge UI.
- `features/orders/`
  - Mock order data, selected order state, order list, and order details.
- `features/chat/`
  - Chat button, chat modal, and channel creation hook.
- `features/users/constants/`
  - Current Sendbird user id constant.

## Useful Commands

Run commands from the relevant version directory.

For Version 0:

```sh
cd version-0
npm run build
npm run lint
npm run dev
```

For Version 1:

```sh
cd version-1
npm run build
npm run lint
npm run dev
```

Docker compose services:

```sh
docker compose up --build version-0
docker compose up --build version-1
```

Ports:

- `version-0`: `http://localhost:5173`
- `version-1`: `http://localhost:5174`

## Runtime Notes

- Both frontends use Vite.
- Both frontends currently depend on `@sendbird/uikit-react`.
- Both compose services mount `.env` from each frontend directory into `/app/.env`.
- Vite client-side environment variables are public in the browser bundle, so access tokens should not be treated as backend secrets just because they moved to `.env`.

## Git/Change Safety

- Preserve `version-0` as the baseline unless explicitly asked otherwise.
- Prefer implementing decoupling experiments in `version-1` or future version directories.
- If generated files such as `dist/` or `node_modules/` already exist, avoid editing or relying on them for architectural conclusions.
