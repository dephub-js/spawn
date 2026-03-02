/* eslint-disable perfectionist/sort-objects */
import { glob } from '@dephub/glob';
import { cwd } from '@dephub/path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const entry = await glob(['src/**/*.ts'], {
  absolute: true,
});

const dtsPlugin = dts({
  entryRoot: 'src',
  outDir: 'dist',
  tsconfigPath: './tsconfig.json',
  exclude: ['vite.config.ts', 'src/cli.ts'],
});

export default defineConfig({
  build: {
    ssr: true,
    lib: {
      entry,
    },
    target: 'esnext',
    reportCompressedSize: true,
    minify: 'esbuild',
    emptyOutDir: true,

    rollupOptions: {
      external: ['*'],
      output: [
        {
          format: 'esm',
          dir: 'dist',
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: 'src',
        },
      ],
    },
  },
  plugins: [dtsPlugin],
  resolve: {
    alias: {
      '@': cwd('src'),
    },
  },
});
