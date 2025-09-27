#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const envContent = `# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:9000

# Development Configuration
NODE_ENV=development
`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  if (fs.existsSync(envPath)) {
    console.log('✅ .env.local already exists');
    console.log('📝 Please ensure it contains: NEXT_PUBLIC_API_BASE_URL=http://localhost:9000');
  } else {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file with correct API configuration');
  }
  
  console.log('\n🔧 Environment setup complete!');
  console.log('📋 Make sure your backend is running on http://localhost:9000');
  console.log('🚀 Restart your Next.js development server after this setup');
  
} catch (error) {
  console.error('❌ Error setting up environment:', error.message);
}
