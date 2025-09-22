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
  
  // Check visibility across all models
  const [chatgptResult, geminiResult] = await Promise.all([
    checkChatGPTVisibility(domain),
    checkGeminiVisibility(domain)
  ]);
  
  // Skip Perplexity for now
  const perplexityResult = {
    model: 'Perplexity',
    visible: false,
    score: 0,
    mentions: 0,
    context: [],
    response: 'Skipped'
  };

  // Calculate overall score
  const overallScore = Math.round(
    (chatgptResult.score + geminiResult.score + perplexityResult.score) / 3
  );

  // Generate trends (mock for now, could be historical data)
  const trends = generateTrends(overallScore);

  // Generate prompts based on actual results
  const prompts = generatePrompts(domain, [chatgptResult, geminiResult, perplexityResult]);

  // Generate competitors (mock for now)
  const competitors = generateCompetitors(domain, overallScore);

  // Generate highlights
  const highlights = generateHighlights(chatgptResult, geminiResult, perplexityResult);

  return {
    domain,
    overallScore,
    models: {
      chatgpt: chatgptResult,
      claude: geminiResult, // Using Gemini instead of Claude
      perplexity: perplexityResult
    },
    trends,
    prompts,
    competitors,
    highlights
  };
}

async function checkChatGPTVisibility(domain: string): Promise<VisibilityResult> {
  try {
    const testPrompts = generateTestPrompts(domain);
    let totalMentions = 0;
    let visibleResponses = 0;
    const contexts: string[] = [];

    for (const testPrompt of testPrompts.slice(0, 3)) { // Test with 3 prompts
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: testPrompt }],
          max_tokens: 500,
          temperature: 0.7
        });

        const responseText = response.choices[0]?.message?.content || '';
        const mentions = countDomainMentions(responseText, domain);
        
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
    const testPrompts = generateTestPrompts(domain);
    let totalMentions = 0;
    let visibleResponses = 0;
    const contexts: string[] = [];

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    for (const testPrompt of testPrompts.slice(0, 3)) {
      try {
        const result = await model.generateContent(testPrompt);
        const response = await result.response;
        const responseText = response.text();
        const mentions = countDomainMentions(responseText, domain);
        
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
  
  for (const template of TEST_PROMPTS.slice(0, 5)) {
    const useCase = template.use_cases[0];
    const title = template.prompt
      .replace('{category}', template.category)
      .replace('{use_case}', useCase);
    
    // Check if domain was found in any model
    const visibleIn = results.find(r => r.visible);
    
    prompts.push({
      title,
      status: (visibleIn ? 'visible' : 'not-visible') as 'visible' | 'not-visible',
      firstShownIn: visibleIn?.model || 'None',
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
}> {
  const competitors = [
    { rank: 1, brand: domain, score, change: 'up' as const, changeValue: 12 },
    { rank: 2, brand: 'Competitor A', score: score - 10, change: 'down' as const, changeValue: 5 },
    { rank: 3, brand: 'Competitor B', score: score - 15, change: 'up' as const, changeValue: 3 },
    { rank: 4, brand: 'Competitor C', score: score - 20, change: 'neutral' as const, changeValue: 0 },
    { rank: 5, brand: 'Competitor D', score: score - 25, change: 'down' as const, changeValue: 8 }
  ];
  
  return competitors;
}

function generateHighlights(chatgpt: VisibilityResult, claude: VisibilityResult, perplexity: VisibilityResult): Array<{
  type: 'visibility-drop' | 'new-competitor' | 'missed-prompt';
  title: string;
  description: string;
  value: string;
}> {
  const highlights = [];
  
  if (perplexity.score < 50) {
    highlights.push({
      type: 'visibility-drop',
      title: 'Visibility Drop',
      description: 'Your visibility in Perplexity is low',
      value: `${perplexity.score}%`
    });
  }
  
  if (chatgpt.visible && claude.visible) {
    highlights.push({
      type: 'new-competitor',
      title: 'Strong Performance',
      description: 'You are visible in both ChatGPT and Claude',
      value: '2/3 models'
    });
  }
  
  const totalMentions = chatgpt.mentions + claude.mentions + perplexity.mentions;
  if (totalMentions < 3) {
    highlights.push({
      type: 'missed-prompt',
      title: 'Missed Opportunities',
      description: 'Low mention count across all models',
      value: `${totalMentions} mentions`
    });
  }
  
  return highlights;
}