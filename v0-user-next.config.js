/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
  },
  webpack: (config) => {
    // Resolve the sharp package warning
    config.externals = [...(config.externals || []), "sharp"]
    return config
  },
}

module.exports = nextConfig
