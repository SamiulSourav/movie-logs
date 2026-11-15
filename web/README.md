# Movie Logs: web

Vue 3 + Vite + TypeScript + Pinia + Vue Router.

```bash
npm install
cp .env.example .env   # VITE_USE_MOCKS=true runs without a backend
npm run dev
```

Set `VITE_USE_MOCKS=false` once the server is running on port 3000; Vite proxies `/api` to it.

## Layers

- `src/api/`: the only code that knows URLs. `client.ts` handles base URL, auth header and errors; each resource file switches between the real endpoint and `mock.ts`.
- `src/stores/`: Pinia setup stores. `library` does optimistic updates with rollback; `recommendations` gates generation behind `MIN_RATINGS`.
- `src/composables/`: `useDebouncedSearch` (debounce + abort of stale requests).
- `src/views/`: one per route. `src/components/`: presentational pieces that read from stores where it saves prop drilling.
- `src/types/`: DTOs. Move to a shared package with zod schemas when the server exists.
