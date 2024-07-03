import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // Alias 'ws' to a WebSocket shim/polyfill
      // ws: path.resolve(path.join("node_modules/ws/index.js")),
      // Buffer: path.resolve(path.join("node_modules/buffer/index.js")),
    },
  },

  // define: {
  //   // By default, Vite doesn't include shims for NodeJS/
  //   // necessary for segment analytics lib to work
  //   global: {},
  // },

  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          ws: true,
        }),
      ],
    },
  },
});
