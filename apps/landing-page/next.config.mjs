/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["database"],
  serverExternalPackages: ["@prisma/client", "database"]
};
export default nextConfig;
