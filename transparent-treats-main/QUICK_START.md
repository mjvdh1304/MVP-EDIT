# Quick Reference: Development Testing

## Start Development Server

### Option 1: Local Data Only (Default)
```bash
npm run dev
```
- App uses only `src/data/products.ts`
- No API calls
- Fastest startup

### Option 2: With Mock API (MSW)
```bash
VITE_ENABLE_MSW=true VITE_API_BASE_URL=http://localhost:3001 npm run dev
```
- MSW intercepts fetch calls
- Returns mock responses from `src/mocks/handlers.ts`
- No backend required
- Test API integration locally

### Option 3: With Real Backend
```bash
VITE_ENABLE_MSW=false VITE_USE_REMOTE_API=true VITE_API_BASE_URL=http://localhost:3001 npm run dev
```
- Makes real fetch calls to backend
- Falls back to local data on network error
- Backend must be running on `localhost:3001`

### Option 4: Production Build
```bash
npm run build
npm run preview
```
- Production-optimized build
- Opens at `http://localhost:4173`

## Testing

### Run Unit Tests
```bash
# View test file (reference implementation)
cat src/services/api.test.ts

# Requires: npm install --save-dev vitest @testing-library/react
npm test -- src/services/api.test.ts
```

Tests validate:
- Adapter fallback to local data
- Network error handling
- 8-second timeout resilience
- Mock API responses

## Verify Quality

### Lint
```bash
npm run lint
```

### Build
```bash
npm run build
```

## Environment Variables

Create `.env` in project root (or use `.env.example` as template):

```bash
# Enable Mock Service Worker (dev only)
VITE_ENABLE_MSW=true

# Enable remote API calls (default false)
VITE_USE_REMOTE_API=true

# Backend API base URL (required if VITE_USE_REMOTE_API=true)
VITE_API_BASE_URL=http://localhost:3001
```

## Debugging

### Check MSW Status
```js
// In browser DevTools console:
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log("Service workers:", regs);
});
```

### View MSW Logs
- Open DevTools → Console
- Look for `[MSW]` messages
- Check Network tab for intercepted requests

### Test API Response
```js
// In console:
fetch("http://localhost:3001/api/health").then(r => r.json()).then(d => console.log(d));
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MSW not intercepting | Verify `VITE_ENABLE_MSW=true`, restart dev server, check `public/mockServiceWorker.js` exists |
| Products page blank | Check browser console for errors, verify `VITE_USE_REMOTE_API` setting |
| API returning 404 | Check URL matches handler pattern in `src/mocks/handlers.ts` |
| Slow responses | Likely timeout — check 8-second limit, verify network in DevTools |

## Files Reference

| File | Purpose |
|------|---------|
| `src/services/api.ts` | API adapter with fallbacks |
| `src/mocks/handlers.ts` | MSW request handlers |
| `src/mocks/browser.ts` | MSW setup |
| `src/services/api.test.ts` | Unit tests (reference) |
| `TESTING_GUIDE.md` | Full testing documentation |
| `.env.example` | Configuration template |
| `public/mockServiceWorker.js` | Service worker (auto-generated) |

## Next Steps

1. **Backend team**: Implement API endpoints per `openapi.yml`
2. **Test with mocks**: `VITE_ENABLE_MSW=true npm run dev`
3. **Test with backend**: `VITE_USE_REMOTE_API=true npm run dev`
4. **Verify fallback**: Disable backend, see app still works
5. **Integrate tests**: Add to CI/CD pipeline
6. **Monitor**: Track API latency and errors in production
