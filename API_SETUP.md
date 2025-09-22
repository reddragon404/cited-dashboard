# API Setup Guide

To use the real AI visibility checking features, you need to set up API keys for the AI services.

## Required API Keys

### 1. OpenAI API Key (Required)
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env.local` file:
   ```
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

### 2. Google Gemini API Key (Required)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file:
   ```
   GOOGLE_API_KEY=your-google-gemini-api-key-here
   ```

### 3. Perplexity API Key (Optional)
1. Go to [Perplexity API](https://www.perplexity.ai/settings/api)
2. Create a new API key
3. Add it to your `.env.local` file:
   ```
   PERPLEXITY_API_KEY=pplx-your-perplexity-api-key-here
   ```

## How It Works

The system will:

1. **Test Multiple Prompts**: Generate standardized prompts across different categories (productivity, marketing, development, etc.)

2. **Query AI Models**: Send these prompts to ChatGPT, Claude, and Perplexity APIs

3. **Analyze Responses**: Check if your domain is mentioned in the AI responses

4. **Calculate Scores**: Generate visibility scores based on:
   - Number of mentions
   - Context relevance
   - Response quality

5. **Generate Report**: Create a comprehensive report with:
   - Overall visibility score
   - Model-specific scores
   - Trend analysis
   - Competitor comparison
   - Actionable insights

## Cost Considerations

- **OpenAI (GPT-4)**: ~$0.01-0.03 per domain check
- **Google Gemini**: ~$0.005-0.015 per domain check
- **Perplexity**: ~$0.005-0.01 per domain check

Total cost per domain analysis: **~$0.02-0.055**

## Testing

Once you've added your API keys:

1. Restart the development server
2. Login to the dashboard
3. Search for any domain (e.g., "notion.com", "slack.com")
4. Wait 10-30 seconds for the analysis to complete
5. View the real AI visibility report

## Troubleshooting

- **API Key Errors**: Make sure your API keys are correctly formatted and have sufficient credits
- **Rate Limits**: The system includes delays between API calls to respect rate limits
- **Timeout Issues**: Large domains may take longer to analyze - this is normal
- **No Results**: Some domains may not be mentioned in AI responses, which is valuable data

## Security

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Consider using API key rotation for production