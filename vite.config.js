import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "/je-cree-mes-dictees/",
    build: {
        outDir: "dist",
    },
});
