import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'jsdom',
    setupFiles: 'src/setupTests.ts',
    globals: true,
  },
};

export default config;
