#!/bin/bash

# ScrollLearn Backend Setup Script for Cloudflare Workers

echo "🚀 Setting up ScrollLearn Backend for Cloudflare Workers..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if wrangler is installed globally
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI globally..."
    npm install -g wrangler
fi

# Build the project
echo "🔨 Building the project..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'wrangler login' to authenticate with Cloudflare"
echo "2. Set your environment variables:"
echo "   - wrangler secret put MONGODB_URI"
echo "   - wrangler secret put GEMINI_API_KEY"
echo "3. Deploy with 'npm run deploy'"
echo ""
echo "For development, run 'npm run dev'"
echo "For more information, see DEPLOYMENT.md"
