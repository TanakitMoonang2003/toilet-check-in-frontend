/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
  // env: {
  //   NEXT_PUBLIC_URL: 'http://localhost:3000/',
  //   NEXT_PUBLIC_BACK_END: 'http://localhost:5000/',
  //   NEXT_PUBLIC_MAPBOX_TOKEN: 'pk.eyJ1IjoibmFtZXZveTEyMyIsImEiOiJjbTkyemt2cmowYWM5MndzNDZ5eDN2d3B1In0.v7kTe6KFT0ikRTqYngqQyg'
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
