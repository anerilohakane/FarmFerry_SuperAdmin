/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow development origins for CORS
  allowedDevOrigins: [
    '192.168.0.102',
    '192.168.0.104',
    'localhost',
    '127.0.0.1'
  ],
  
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
  
  // Configure headers for CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
