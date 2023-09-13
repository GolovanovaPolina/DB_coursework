import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        plugins: [react()],
        server: {
            proxy: {
                "/data-service": {
                    // target: "http://192.168.56.1:8081",
                    target: "http://localhost:8081",
                    rewrite: (path) => path.replace("/data-service", ""),
                },
            },
        },
    });
};
