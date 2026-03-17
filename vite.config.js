import { defineConfig } from "vite";
import { resolve } from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
            }
        }
    },
    css: {
        devSourcemap: true
    },
    plugins: [
        ViteImageOptimizer({
            png: {
                quality: 75
            },
            jpg: {
                quality: 75
            },
            jpeg: {
                quality: 75
            },
            webp: {
                quality: 70
            },
            avif: {
                quality: 60
            },
            svg: {
                multipass: true,
                plugins: [
                    {
                        name: 'preset-default',
                        params: {
                            overrides: {
                                cleanupNumericValues: false,
                                removeViewBox: false, // https://github.com/svg/svgo/issues/1128
                            },
                            cleanupIDs: {
                                minify: false,
                                remove: false,
                            },
                            convertPathData: false,
                        },
                    },
                    'sortAttrs',
                    {
                        name: 'addAttributesToSVGElement',
                        params: {
                            attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                        },
                    },
                ]
            }
        })
    ]
})