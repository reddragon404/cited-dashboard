# 🔑 API Keys Setup Guide

## Quick Setup

Run the setup script to add your API keys:
```bash
./setup-api-keys.sh
```

## How to Get API Keys

### 1. OpenAI API Key (ChatGPT)
- Go to: https://platform.openai.com/api-keys
- Click "Create new secret key"
- Copy the key (starts with `sk-`)
- **Cost**: ~$0.01-0.03 per domain check

### 2. Google Gemini API Key
- Go to: https://makersuite.google.com/app/apikey
- Click "Create API key"
- Copy the key
- **Cost**: Free tier available, very cheap

### 3. Perplexity API Key (Optional)
- Go to: https://www.perplexity.ai/settings/api
- Sign up and get your API key
- **Cost**: ~$0.005-0.01 per domain check

## What Each API Does

- **OpenAI (ChatGPT)**: Tests if your domain is mentioned in ChatGPT responses
- **Google Gemini**: Tests if your domain is mentioned in Gemini responses  
- **Perplexity**: Tests if your domain is mentioned in Perplexity search results

## Total Cost Per Analysis
- **With all APIs**: ~$0.025-0.06 per domain
- **With just OpenAI + Gemini**: ~$0.015-0.04 per domain

## Testing

Once you've added your keys:

1. **Restart the server**: `npm run dev`
2. **Login**: Use `admin@cited.com` / `password`
3. **Search**: Enter any domain (e.g., `notion.com`, `slack.com`)
4. **Wait**: Analysis takes 30-60 seconds
5. **View**: Real AI visibility report with actual data!

## Troubleshooting

- **401 Errors**: Check your API keys are correct
- **Rate Limits**: The system includes delays between calls
- **No Results**: Some domains may not be mentioned in AI responses (this is valuable data!)
- **Timeout**: Large domains may take longer to analyze

## Security

- Never commit API keys to git
- Keys are stored in `.env.local` (already in `.gitignore`)
- Use environment variables in production