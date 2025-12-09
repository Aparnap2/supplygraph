/**
 * @deprecated This file is deprecated.
 * Please use `src/lib/prisma.ts` for server-side Prisma client initialization.
 * For client-side data fetching, use `src/lib/prisma-server.ts` with TanStack Start server functions.
 */

// Re-export the new functions for backward compatibility
export { getPrisma } from './src/lib/prisma'
export default getPrisma

// Note: The old synchronous `prisma` export is no longer available
// Please use `await getPrisma()` or the server functions from `src/lib/prisma-server.ts`