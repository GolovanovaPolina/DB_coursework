import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        plugins: [react()],
        server: {
            proxy: {
                "/data-service": {
                    target: "http://127.0.0.1:8081",
                    rewrite: (path) => path.replace(/^\/data-service/, ''),
                },
            },
            host: "0.0.0.0",
        },
    });
};
