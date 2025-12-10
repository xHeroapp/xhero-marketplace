/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  /* config options here */
  // ignoring lint and type errors for now
  // just to help with faster build process
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // supabase images
      {
        protocol: "https",
        hostname: "fhvjjbnjecwbdslvemsa.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // unsplash images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "another.cdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
