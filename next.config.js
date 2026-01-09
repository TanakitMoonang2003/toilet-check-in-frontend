/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // ใช้ environment variable สำหรับ backend URL
    // ถ้าไม่มี NEXT_PUBLIC_BACK_END ให้ใช้ localhost สำหรับ development
    const backendUrl = process.env.NEXT_PUBLIC_BACK_END || 'http://localhost:5000';
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
