import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        plugins: [react()],
        server: {
            proxy: {
                "/data-service": {
                    target: "http://localhost:3000",
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace("/data-service/", ""),
                },
            },
        },
    });
};
