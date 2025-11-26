import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
git add .
git commit -m "Fix GitHub Pages base path and deployment"
git push
export default defineConfig({
  plugins: [react()],
  base: '/toyhouse-css-editor/',
});
