import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Previene ataques XSS
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Desactiva el iframe embedding
          { key: "X-Frame-Options", value: "DENY" },
          // Evita inferencias de tipo de contenido
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Política de seguridad de contenido
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://res.cloudinary.com",
              "object-src 'none'",
              "base-uri 'self'",
              // ✅ CSP diferente según ambiente
              isDevelopment
                ? "connect-src 'self' ws: wss: http: https: https://res.cloudinary.com https://api.cloudinary.com"
                : "connect-src 'self' ws: wss: https://res.cloudinary.com https://api.cloudinary.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          // Seguridad de transporte
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          // Política de permisos
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['http://localhost:3000'],
    },
  },
};

export default nextConfig;