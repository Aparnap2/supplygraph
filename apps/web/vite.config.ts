import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import netlify from '@netlify/vite-plugin-tanstack-start'

const config = defineConfig({
  plugins: [
    devtools(),
    netlify(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart(),
    viteReact(),
  ],
  // Configure resolve aliases for better compatibility
  resolve: {
    alias: {
      // Handle Node.js built-ins that Prisma might use
    },
  },
  // Define global constants for browser compatibility
  define: {
    global: 'globalThis',
  },
  // Configure SSR to properly handle Prisma
  ssr: {
    noExternal: [
      // These need to be processed by Vite for proper CommonJS/ESM interop
      '@prisma/client',
      '@prisma/adapter-pg'
    ],
    external: [
      // Exclude server-only files from client bundle
      /\.server\.ts$/,
      /\.server\.tsx$/,
      '@prisma/client/runtime',
      '@prisma/client/runtime/library'
    ]
  },
  // Vite 7+ optimizeDeps configuration
  optimizeDeps: {
    // Force optimization for Prisma client
    force: true,
    include: [
      // Pre-bundle these for better performance
    ],
    // Exclude all Prisma client code as it's Node.js-only
    exclude: [
      '@prisma/client',
      '@prisma/client/runtime',
      '@prisma/client/runtime/library',
      '@prisma/client/wasm',
      '@prisma/adapter-pg'
    ]
  },
  // Build configuration
  build: {
    rollupOptions: {
      external: (id) => {
        // Exclude all Prisma-related modules from client bundle
        if (id.includes('@prisma/client')) {
          return true;
        }
        if (id.includes('prisma')) {
          return true;
        }
        if (id.includes('@prisma/adapter-pg')) {
          return true;
        }
        return false;
      },
      onwarn: (warning, warn) => {
        // Suppress warnings about certain external modules
        if (warning.code === 'UNRESOLVED_IMPORT' &&
            (warning.source?.includes('@tanstack/start') ||
             warning.source?.includes('@prisma/client') ||
             warning.source?.includes('stripe'))) {
          return;
        }
        warn(warning);
      },
    },
  },
})

export default config
