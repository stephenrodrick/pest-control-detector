/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp']
  },
  // Increase the body size limit for file uploads
  serverRuntimeConfig: {
    maxFileSize: '100mb'
  },
  // Configure API routes for large uploads
  api: {
    bodyParser: {
      sizeLimit: '100mb'
    }
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
