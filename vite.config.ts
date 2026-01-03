import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: mode === "development" ? "/" : "/patienthistory/", // 👈 production base for GH Pages
  server: {
    host: true,       // listen on all local network interfaces
    port: 5173,       // default Vite port for dev
    strictPort: true, // fail if port is already in use
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
