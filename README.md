# Cited - AI Visibility Dashboard

A SaaS dashboard that tracks how visible your domain is across different AI models (ChatGPT, Gemini, Perplexity).

## Features

- **Real AI Visibility Analysis** - Check actual mentions in AI responses
- **Multi-Model Support** - ChatGPT, Google Gemini, Perplexity
- **Competitor Analysis** - See how you compare to competitors
- **Trend Tracking** - Monitor visibility over time
- **Professional Dashboard** - Clean, modern UI for clients

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **OpenAI API** - ChatGPT integration
- **Google Gemini API** - Gemini integration
- **JWT Authentication** - Secure user sessions

## Environment Variables

Add these to your Vercel environment variables:

```
OPENAI_API_KEY=your-openai-api-key
GOOGLE_API_KEY=your-google-gemini-api-key
PERPLEXITY_API_KEY=your-perplexity-api-key
JWT_SECRET=your-jwt-secret-key
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Add environment variables
4. Run development server: `npm run dev`

## Deployment

This project is optimized for Vercel deployment with zero configuration needed.

## Demo Credentials

- **Email**: admin@cited.com
- **Password**: password

## API Usage

The dashboard makes real API calls to analyze domain visibility:
- **OpenAI**: ~$0.01-0.03 per analysis
- **Gemini**: Free tier available
- **Perplexity**: ~$0.005-0.01 per analysis

Total cost per domain analysis: ~$0.025-0.06