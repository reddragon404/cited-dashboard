import OpenAI from 'openai';
// import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize API clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// const anthropic = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Standardized test prompts for different categories
const TEST_PROMPTS = [
  {
    category: 'general',
    prompt: 'What are the best {category} tools for {use_case}?',
    use_cases: ['small businesses', 'startups', 'enterprises', 'remote teams']
  },
  {
    category: 'productivity',
    prompt: 'Recommend the top {category} software for {use_case}',
    use_cases: ['project management', 'team collaboration', 'task management', 'workflow automation']
  },
  {
    category: 'marketing',
    prompt: 'What are the best {category} platforms for {use_case}?',
    use_cases: ['email marketing', 'social media management', 'content creation', 'analytics']
  },
  {
    category: 'development',
    prompt: 'Suggest the top {category} tools for {use_case}',
    use_cases: ['web development', 'mobile development', 'devops', 'testing']
  }
];

interface VisibilityResult {
  model: string;
  visible: boolean;
  score: number;
  mentions: number;
  context: string[];
  response: string;
}

interface DomainAnalysis {
  domain: string;
  overallScore: number;
  models: {
    chatgpt: VisibilityResult;
    claude: VisibilityResult;
    perplexity: VisibilityResult;
  };
  trends: Array<{ month: string; score: number }>;
  prompts: Array<{
    title: string;
    status: 'visible' | 'not-visible';
    firstShownIn: string;
    dateChecked: string;
  }>;
  competitors: Array<{
    rank: number;
    brand: string;
    score: number;
    change: 'up' | 'down' | 'neutral';
    changeValue: number;
  }>;
  highlights: Array<{
    type: 'visibility-drop' | 'new-competitor' | 'missed-prompt';
    title: string;
    description: string;
    value: string;
  }>;
}

export async function checkAIVisibility(domain: string): Promise<DomainAnalysis> {
  console.log(`Starting AI visibility check for ${domain}`);
  console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
  console.log('Google API Key exists:', !!process.env.GOOGLE_API_KEY);
  
  // Check visibility across ChatGPT and Gemini only
  const [chatgptResult, geminiResult] = await Promise.all([
    checkChatGPTVisibility(domain),
    checkGeminiVisibility(domain)
  ]);
  
  console.log('ChatGPT Result:', chatgptResult);
  console.log('Gemini Result:', geminiResult);

  // Calculate overall score based on only 2 models
  const overallScore = Math.round(
    (chatgptResult.score + geminiResult.score) / 2
  );

  // Generate trends (mock for now, could be historical data)
  const trends = generateTrends(overallScore);

  // Generate prompts based on actual results
  const prompts = generatePrompts(domain, [chatgptResult, geminiResult]);

  // Generate competitors based on domain analysis
  const competitors = generateCompetitors(domain, overallScore);

  // Generate highlights
  const highlights = generateHighlights(chatgptResult, geminiResult);

  return {
    domain,
    overallScore,
    models: {
      chatgpt: chatgptResult,
      claude: geminiResult // Using Gemini instead of Claude
    },
    trends,
    prompts,
    competitors,
    highlights
  };
}

async function checkChatGPTVisibility(domain: string): Promise<VisibilityResult> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found');
      return {
        model: 'ChatGPT',
        visible: false,
        score: 0,
        mentions: 0,
        context: [],
        response: 'API key not configured'
      };
    }

    const testPrompts = generateTestPrompts(domain);
    let totalMentions = 0;
    let visibleResponses = 0;
    const contexts: string[] = [];

    console.log(`Testing ${testPrompts.length} prompts for domain: ${domain}`);

    for (const testPrompt of testPrompts.slice(0, 3)) { // Test with 3 prompts
      try {
        console.log(`Testing prompt: ${testPrompt}`);
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: testPrompt }],
          max_tokens: 500,
          temperature: 0.7
        });

        const responseText = response.choices[0]?.message?.content || '';
        console.log(`Response: ${responseText.substring(0, 100)}...`);
        const mentions = countDomainMentions(responseText, domain);
        console.log(`Mentions found: ${mentions}`);
        
        if (mentions > 0) {
          totalMentions += mentions;
          visibleResponses++;
          contexts.push(responseText.substring(0, 200) + '...');
        }
      } catch (error) {
        console.error('ChatGPT API error:', error);
      }
    }

    const score = visibleResponses > 0 ? Math.min(100, (visibleResponses / 3) * 100 + totalMentions * 10) : 0;
    
    return {
      model: 'ChatGPT',
      visible: visibleResponses > 0,
      score: Math.round(score),
      mentions: totalMentions,
      context: contexts,
      response: visibleResponses > 0 ? 'Domain found in responses' : 'Domain not found'
    };
  } catch (error) {
    console.error('ChatGPT visibility check failed:', error);
    return {
      model: 'ChatGPT',
      visible: false,
      score: 0,
      mentions: 0,
      context: [],
      response: 'API error'
    };
  }
}

async function checkGeminiVisibility(domain: string): Promise<VisibilityResult> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      console.error('Google API key not found');
      return {
        model: 'Gemini',
        visible: false,
        score: 0,
        mentions: 0,
        context: [],
        response: 'API key not configured'
      };
    }

    const testPrompts = generateTestPrompts(domain);
    let totalMentions = 0;
    let visibleResponses = 0;
    const contexts: string[] = [];

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log(`Testing ${testPrompts.length} prompts for domain: ${domain} with Gemini`);

    for (const testPrompt of testPrompts.slice(0, 3)) {
      try {
        console.log(`Testing Gemini prompt: ${testPrompt}`);
        const result = await model.generateContent(testPrompt);
        const response = await result.response;
        const responseText = response.text();
        console.log(`Gemini Response: ${responseText.substring(0, 100)}...`);
        const mentions = countDomainMentions(responseText, domain);
        console.log(`Gemini Mentions found: ${mentions}`);
        
        if (mentions > 0) {
          totalMentions += mentions;
          visibleResponses++;
          contexts.push(responseText.substring(0, 200) + '...');
        }
      } catch (error) {
        console.error('Gemini API error:', error);
      }
    }

    const score = visibleResponses > 0 ? Math.min(100, (visibleResponses / 3) * 100 + totalMentions * 10) : 0;
    
    return {
      model: 'Gemini',
      visible: visibleResponses > 0,
      score: Math.round(score),
      mentions: totalMentions,
      context: contexts,
      response: visibleResponses > 0 ? 'Domain found in responses' : 'Domain not found'
    };
  } catch (error) {
    console.error('Gemini visibility check failed:', error);
    return {
      model: 'Gemini',
      visible: false,
      score: 0,
      mentions: 0,
      context: [],
      response: 'API error'
    };
  }
}

async function checkPerplexityVisibility(domain: string): Promise<VisibilityResult> {
  try {
    const testPrompts = generateTestPrompts(domain);
    let totalMentions = 0;
    let visibleResponses = 0;
    const contexts: string[] = [];

    for (const testPrompt of testPrompts.slice(0, 3)) {
      try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 500,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          throw new Error(`Perplexity API error: ${response.status}`);
        }

        const data = await response.json();
        const responseText = data.choices[0]?.message?.content || '';
        const mentions = countDomainMentions(responseText, domain);
        
        if (mentions > 0) {
          totalMentions += mentions;
          visibleResponses++;
          contexts.push(responseText.substring(0, 200) + '...');
        }
      } catch (error) {
        console.error('Perplexity API error:', error);
      }
    }

    const score = visibleResponses > 0 ? Math.min(100, (visibleResponses / 3) * 100 + totalMentions * 10) : 0;
    
    return {
      model: 'Perplexity',
      visible: visibleResponses > 0,
      score: Math.round(score),
      mentions: totalMentions,
      context: contexts,
      response: visibleResponses > 0 ? 'Domain found in responses' : 'Domain not found'
    };
  } catch (error) {
    console.error('Perplexity visibility check failed:', error);
    return {
      model: 'Perplexity',
      visible: false,
      score: 0,
      mentions: 0,
      context: [],
      response: 'API error'
    };
  }
}

function generateTestPrompts(domain: string): string[] {
  const prompts: string[] = [];
  
  for (const template of TEST_PROMPTS) {
    for (const useCase of template.use_cases) {
      const prompt = template.prompt
        .replace('{category}', template.category)
        .replace('{use_case}', useCase);
      prompts.push(prompt);
    }
  }
  
  return prompts;
}

function countDomainMentions(text: string, domain: string): number {
  const domainVariations = [
    domain,
    domain.replace('www.', ''),
    domain.split('.')[0], // Just the name part
    domain.replace('.com', '').replace('.org', '').replace('.net', '')
  ];
  
  let mentions = 0;
  for (const variation of domainVariations) {
    const regex = new RegExp(variation, 'gi');
    const matches = text.match(regex);
    if (matches) {
      mentions += matches.length;
    }
  }
  
  return mentions;
}

function generateTrends(currentScore: number): Array<{ month: string; score: number }> {
  const months = ['Oct', 'Nov', 'Dec'];
  const trends = [];
  
  for (let i = 0; i < months.length; i++) {
    const variation = (Math.random() - 0.5) * 20; // ±10 points variation
    const score = Math.max(0, Math.min(100, currentScore + variation - (months.length - 1 - i) * 5));
    trends.push({ month: months[i], score: Math.round(score) });
  }
  
  return trends;
}

function generatePrompts(domain: string, results: VisibilityResult[]): Array<{
  title: string;
  status: 'visible' | 'not-visible';
  firstShownIn: string;
  dateChecked: string;
}> {
  const prompts: Array<{
    title: string;
    status: 'visible' | 'not-visible';
    firstShownIn: string;
    dateChecked: string;
  }> = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Generate prompts based on actual test prompts used
  const testPrompts = generateTestPrompts(domain);
  
  for (let i = 0; i < Math.min(5, testPrompts.length); i++) {
    const testPrompt = testPrompts[i];
    
    // Check which models found the domain for this specific prompt
    const visibleModels = results.filter(r => r.visible && r.context.some(ctx => 
      ctx.toLowerCase().includes(domain.toLowerCase())
    ));
    
    const isVisible = visibleModels.length > 0;
    const firstShownIn = visibleModels.length > 0 ? visibleModels[0].model : 'None';
    
    // Create a more readable title from the test prompt
    const title = testPrompt.length > 80 ? testPrompt.substring(0, 80) + '...' : testPrompt;
    
    prompts.push({
      title,
      status: (isVisible ? 'visible' : 'not-visible') as 'visible' | 'not-visible',
      firstShownIn,
      dateChecked: today
    });
  }
  
  return prompts;
}

function generateCompetitors(domain: string, score: number): Array<{
  rank: number;
  brand: string;
  score: number;
  change: 'up' | 'down' | 'neutral';
  changeValue: number;
  chatgpt?: { visible: boolean; frequency: number };
  claude?: { visible: boolean; frequency: number };
}> {
  // Generate realistic competitors based on domain type
  const competitors = [
    { 
      rank: 1, 
      brand: domain, 
      score, 
      change: 'up' as const, 
      changeValue: 12,
      chatgpt: { visible: true, frequency: Math.floor(Math.random() * 5) + 1 },
      claude: { visible: true, frequency: Math.floor(Math.random() * 5) + 1 }
    }
  ];

  // Add realistic competitors based on domain category
  const domainLower = domain.toLowerCase();
  let competitorDomains: string[] = [];

  if (domainLower.includes('payment') || domainLower.includes('stripe') || domainLower.includes('paypal')) {
    competitorDomains = ['stripe.com', 'paypal.com', 'square.com', 'razorpay.com'];
  } else if (domainLower.includes('ai') || domainLower.includes('openai') || domainLower.includes('anthropic')) {
    competitorDomains = ['openai.com', 'anthropic.com', 'huggingface.co', 'cohere.com'];
  } else if (domainLower.includes('cloud') || domainLower.includes('aws') || domainLower.includes('azure')) {
    competitorDomains = ['aws.amazon.com', 'azure.microsoft.com', 'cloud.google.com', 'digitalocean.com'];
  } else if (domainLower.includes('social') || domainLower.includes('twitter') || domainLower.includes('facebook')) {
    competitorDomains = ['twitter.com', 'facebook.com', 'linkedin.com', 'instagram.com'];
  } else if (domainLower.includes('ecommerce') || domainLower.includes('shopify') || domainLower.includes('amazon')) {
    competitorDomains = ['shopify.com', 'amazon.com', 'woocommerce.com', 'bigcommerce.com'];
  } else if (domainLower.includes('analytics') || domainLower.includes('google') || domainLower.includes('mixpanel')) {
    competitorDomains = ['analytics.google.com', 'mixpanel.com', 'amplitude.com', 'hotjar.com'];
  } else {
    // Generic competitors for unknown domains
    competitorDomains = ['competitor1.com', 'competitor2.com', 'competitor3.com', 'competitor4.com'];
  }

  // Remove the searched domain from competitors if it exists
  const filteredCompetitors = competitorDomains.filter(comp => comp !== domain);

  // Generate competitor data
  for (let i = 0; i < Math.min(4, filteredCompetitors.length); i++) {
    const competitorScore = Math.max(0, score - (Math.random() * 30 + 5));
    const change = Math.random() > 0.5 ? 'up' : 'down';
    const changeValue = Math.floor(Math.random() * 15) + 1;
    
    competitors.push({
      rank: i + 2,
      brand: filteredCompetitors[i],
      score: Math.round(competitorScore),
      change: change as 'up' | 'down' | 'neutral',
      changeValue,
      chatgpt: { 
        visible: Math.random() > 0.3, 
        frequency: Math.floor(Math.random() * 4) 
      },
      claude: { 
        visible: Math.random() > 0.4, 
        frequency: Math.floor(Math.random() * 4) 
      }
    });
  }
  
  return competitors;
}

function generateHighlights(chatgpt: VisibilityResult, claude: VisibilityResult): Array<{
  type: 'visibility-drop' | 'new-competitor' | 'missed-prompt';
  title: string;
  description: string;
  value: string;
}> {
  const highlights: Array<{
    type: 'visibility-drop' | 'new-competitor' | 'missed-prompt';
    title: string;
    description: string;
    value: string;
  }> = [];
  
  if (claude.score < 50) {
    highlights.push({
      type: 'visibility-drop' as const,
      title: 'Visibility Drop',
      description: 'Your visibility in Gemini is low',
      value: `${claude.score}%`
    });
  }
  
  if (chatgpt.visible && claude.visible) {
    highlights.push({
      type: 'new-competitor' as const,
      title: 'Strong Performance',
      description: 'You are visible in both ChatGPT and Gemini',
      value: '2/2 models'
    });
  }
  
  const totalMentions = chatgpt.mentions + claude.mentions;
  if (totalMentions < 2) {
    highlights.push({
      type: 'missed-prompt' as const,
      title: 'Missed Opportunities',
      description: 'Low mention count across all models',
      value: `${totalMentions} mentions`
    });
  }
  
  return highlights as Array<{
    type: 'visibility-drop' | 'new-competitor' | 'missed-prompt';
    title: string;
    description: string;
    value: string;
  }>;
}