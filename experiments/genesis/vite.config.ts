import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';
export default defineConfig({ base: process.env.GITHUB_PAGES_BUILD === '1' ? '/genesis/' : '/', css: { postcss: { plugins: [tailwindcss()] } }, plugins: [vinext()], server: { host: '127.0.0.1' } });
