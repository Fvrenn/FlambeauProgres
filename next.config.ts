import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
    // Note : Next.js 16 ne lance plus ESLint pendant `next build` (la clé `eslint`
    // de NextConfig a été retirée). Le lint se fait via `npm run lint` / en CI.
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                ],
            },
        ];
    },
    experimental: {
        authInterrupts: true,
        serverActions: {
            bodySizeLimit: '10mb'
        }
    }
};
export default nextConfig;