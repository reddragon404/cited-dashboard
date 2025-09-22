#!/bin/bash

echo "🔑 API Key Setup for Cited Dashboard"
echo "====================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found. Creating it..."
    cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# AI API Keys - Replace with your actual keys
OPENAI_API_KEY=your-openai-api-key-here
GOOGLE_API_KEY=your-google-gemini-api-key-here
PERPLEXITY_API_KEY=your-perplexity-api-key-here

# JWT Secret
JWT_SECRET=your-jwt-secret-key-change-in-production
EOF
fi

echo "📝 Please provide your API keys:"
echo ""

# OpenAI API Key
echo "1. OpenAI API Key (starts with 'sk-'):"
read -p "   Enter your OpenAI API key: " OPENAI_KEY
if [ ! -z "$OPENAI_KEY" ]; then
    sed -i.bak "s/OPENAI_API_KEY=your-openai-api-key-here/OPENAI_API_KEY=$OPENAI_KEY/" .env.local
    echo "   ✅ OpenAI API key added"
else
    echo "   ⚠️  Skipped OpenAI API key"
fi

echo ""

# Google Gemini API Key
echo "2. Google Gemini API Key (get from https://makersuite.google.com/app/apikey):"
read -p "   Enter your Google API key: " GOOGLE_KEY
if [ ! -z "$GOOGLE_KEY" ]; then
    sed -i.bak "s/GOOGLE_API_KEY=your-google-gemini-api-key-here/GOOGLE_API_KEY=$GOOGLE_KEY/" .env.local
    echo "   ✅ Google Gemini API key added"
else
    echo "   ⚠️  Skipped Google Gemini API key"
fi

echo ""

# Perplexity API Key
echo "3. Perplexity API Key (get from https://www.perplexity.ai/settings/api):"
read -p "   Enter your Perplexity API key: " PERPLEXITY_KEY
if [ ! -z "$PERPLEXITY_KEY" ]; then
    sed -i.bak "s/PERPLEXITY_API_KEY=your-perplexity-api-key-here/PERPLEXITY_API_KEY=$PERPLEXITY_KEY/" .env.local
    echo "   ✅ Perplexity API key added"
else
    echo "   ⚠️  Skipped Perplexity API key"
fi

echo ""
echo "🎉 Setup complete! Your API keys have been added to .env.local"
echo ""
echo "📋 Next steps:"
echo "   1. Restart your development server: npm run dev"
echo "   2. Login to the dashboard"
echo "   3. Search for any domain to test real AI visibility checking"
echo ""
echo "💡 Note: You can add more API keys later by editing .env.local"