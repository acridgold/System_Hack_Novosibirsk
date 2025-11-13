import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
    root: path.resolve(__dirname, 'Front-End'),
    plugins: [react()],
    base: './', // Относительные пути работают везде!
    publicDir: path.resolve(__dirname, 'Front-End', 'public'),
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: true,
        sourcemap: false,
    },
    server: {
        port: 5173,
        open: true,
    },
    preview: {
        port: 4173,
        open: true,
    },
}));
