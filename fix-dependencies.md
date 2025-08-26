# Fix Dependencies Script

Run these commands to fix the Clerk middleware issues:

## 1. Stop the development server
Press `Ctrl+C` to stop the current dev server

## 2. Clear node_modules and reinstall
```bash
# Remove node_modules and lock file
rm -rf node_modules
rm pnpm-lock.yaml

# Reinstall dependencies
pnpm install
```

## 3. Alternative: Use npm instead of pnpm
If pnpm continues to have issues, try using npm:

```bash
# Remove pnpm files
rm -rf node_modules
rm pnpm-lock.yaml

# Install with npm
npm install
npm run dev
```

## 4. If still having issues, downgrade Clerk
```bash
pnpm add @clerk/nextjs@4.29.12 @clerk/themes@1.7.9
```

## 5. Restart development server
```bash
pnpm dev
# or
npm run dev
```

The middleware has been simplified to use the stable `authMiddleware` from Clerk v4, which should resolve the import errors.
