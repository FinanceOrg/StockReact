// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
        rules: {
            // turn .svg imports into React components via SVGR
            "*.svg": {
                loaders: ["@svgr/webpack"],
                as: "*.js",
            },
        },
    },
};

export default nextConfig;
