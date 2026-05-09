/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["database"],
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"]
  }
};
export default nextConfig;
