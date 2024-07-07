import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig({
    plugins: [
        react(),
        copy({
            targets: [
              { src: 'templates/assets/img/logoFull.svg', dest: 'templates/assets' }
            ],
            hook: 'writeBundle' // Use the `writeBundle` hook to copy after the file has been generated
          })
    ],
    optimizeDeps: {
        include: ['date-fns']
    },
    build: {
        outDir: 'templates',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    let extType = assetInfo.name.split('.').at(1);
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        extType = 'img';
                    }
                    return `assets/${extType}/[name][extname]`;
                },
                chunkFileNames: 'assets/js/[name].js',
                entryFileNames: 'assets/js/[name].js',
            },
        },
    },
    watch: {
        usePolling: true,
        interval: 500,
    },
    server: {
        port: 5000,
        proxy: {
            '/api': 'https://10.1.1.44:80',  // Proxy API requests to Flask
        },
        watch: {
            usePolling: true,
            interval: 500,
        },
        https: {
            key: fs.readFileSync(path.resolve(__dirname, '/app/keys/selfsigned.key')),
            cert: fs.readFileSync(path.resolve(__dirname, '/app/keys/selfsigned.crt')),
          },
        host: '0.0.0.0', // Utiliser l'adresse IP
    },
});
