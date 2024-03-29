import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [sveltekit()],
  test: {
    include: ['tests/*.test.ts'],
    environment: 'jsdom',
  },
};

export default config;
