
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
  css: {
    devSourcemap: true,
  },
  server: {
    port: 3000,
  },
  plugins: [tailwindcss(),  tsconfigPaths(), devtoolsJson(),],
});
