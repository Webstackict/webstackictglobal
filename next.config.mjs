/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "uxpilot-auth.appspot.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
