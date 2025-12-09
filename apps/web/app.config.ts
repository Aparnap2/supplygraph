import { defineConfig } from '@tanstack/react-start/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  vite: {
    plugins: [
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
    // Additional Vite configuration for better compatibility
    define: {
      // Ensure global is available
      global: 'globalThis',
      // Prevent Prisma from being bundled in the browser
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
    // SSR configuration
    ssr: {
      // Make sure Prisma client is not externalized in SSR
      noExternal: ['@prisma/client', '@prisma/adapter-pg'],
    },
    // Optimize dependencies
    optimizeDeps: {
      exclude: [
        // Exclude Prisma runtime from optimization
        '@prisma/client/runtime',
        '@prisma/client/runtime/library',
        '@prisma/client/wasm',
        // Exclude Node.js built-ins
        'child_process',
        'fs',
        'path',
        'os',
        'crypto',
        'stream',
        'util',
      ],
    },
  },
})