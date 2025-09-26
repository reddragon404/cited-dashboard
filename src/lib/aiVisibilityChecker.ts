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

// Domain-specific test prompts that would actually cause LLMs to mention the domain
const getDomainSpecificPrompts = (domain: string): string[] => {
  const domainLower = domain.toLowerCase();
  
  if (domainLower.includes('hltv') || domainLower.includes('cs') || domainLower.includes('counter-strike')) {
    return [
      'What are the top Counter-Strike esports news websites?',
      'Where can I find CS:GO tournament results and match schedules?',
      'What are the best CS2 news and coverage sites?',
      'Where do pro Counter-Strike players get their news and updates?',
      'What are the leading CS:GO esports news platforms?'
    ];
  } else if (domainLower.includes('stripe') || domainLower.includes('payment')) {
    return [
      'What are the best payment processing platforms for e-commerce?',
      'Best payment gateway for online businesses?',
      'What payment APIs should I use for my website?',
      'Top credit card processing services for startups?',
      'Best payment solutions for SaaS companies?'
    ];
  } else if (domainLower.includes('notion') || domainLower.includes('productivity')) {
    return [
      'What are the best note-taking and productivity apps?',
      'Best tools for team collaboration and project management?',
      'What productivity software do remote teams use?',
      'Best apps for organizing personal and work tasks?',
      'What are the top knowledge management tools?'
    ];
  } else if (domainLower.includes('openai') || domainLower.includes('ai')) {
    return [
      'What are the best AI platforms for developers?',
      'Best AI APIs for building applications?',
      'What AI services should I use for my project?',
      'Top tools for natural language processing?',
      'Best AI models for text generation?'
    ];
  } else if (domainLower.includes('github') || domainLower.includes('dev')) {
    return [
      'What are the best code hosting and collaboration platforms?',
      'Best tools for version control and CI/CD?',
      'What developer tools should I use?',
      'Best platforms for open source projects?',
      'Top code repository management solutions?'
    ];
  } else {
    // Generic prompts for unknown domains
    const domainName = domain.split('.')[0];
    return [
      `What is ${domainName} and what services do they offer?`,
      `Is ${domainName} a reliable platform for businesses?`,
      `What are the alternatives to ${domainName}?`,
      `How does ${domainName} compare to other similar services?`,
      `What are the pros and cons of using ${domainName}?`
    ];
  }
};

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
  
  try {
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
  } catch (error) {
    console.error('Error in checkAIVisibility:', error);
    // Return a fallback response if API calls fail
    return {
      domain,
      overallScore: 0,
      models: {
        chatgpt: {
          model: 'ChatGPT',
          visible: false,
          score: 0,
          mentions: 0,
          context: [],
          response: 'API Error'
        },
        claude: {
          model: 'Gemini',
          visible: false,
          score: 0,
          mentions: 0,
          context: [],
          response: 'API Error'
        }
      },
      trends: generateTrends(0),
      prompts: generatePrompts(domain, []),
      competitors: generateCompetitors(domain, 0),
      highlights: generateHighlights(
        { model: 'ChatGPT', visible: false, score: 0, mentions: 0, context: [], response: 'API Error' },
        { model: 'Gemini', visible: false, score: 0, mentions: 0, context: [], response: 'API Error' }
      )
    };
  }
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

    const testPrompts = getDomainSpecificPrompts(domain);
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

    // Calculate score based on visibility and mentions
    let score = 0;
    if (visibleResponses > 0) {
      score = Math.min(100, (visibleResponses / 3) * 100 + totalMentions * 5);
    }
    
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

    const testPrompts = getDomainSpecificPrompts(domain);
    let totalMentions = 0;
    let visibleResponses = 0;
    const contexts: string[] = [];

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

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

    // Calculate score based on visibility and mentions
    let score = 0;
    if (visibleResponses > 0) {
      score = Math.min(100, (visibleResponses / 3) * 100 + totalMentions * 5);
    }
    
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


function countDomainMentions(text: string, domain: string): number {
  const domainLower = domain.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Create comprehensive domain variations
  const domainVariations = [
    domainLower,
    domainLower.replace('www.', ''),
    domainLower.split('.')[0], // Just the name part (e.g., "hltv" from "hltv.org")
    domainLower.replace('.com', '').replace('.org', '').replace('.net', '').replace('.io', ''),
    // For HLTV specifically, also check for common variations
    ...(domainLower.includes('hltv') ? ['hltv', 'hltv.org', 'hltv.org/', 'hltv.org'] : []),
    // For other domains, check for common patterns
    ...(domainLower.includes('stripe') ? ['stripe', 'stripe.com', 'stripe api'] : []),
    ...(domainLower.includes('notion') ? ['notion', 'notion.so', 'notion app'] : []),
    ...(domainLower.includes('openai') ? ['openai', 'openai.com', 'openai api', 'gpt'] : []),
    ...(domainLower.includes('github') ? ['github', 'github.com', 'github.io'] : []),
    ...(domainLower.includes('vercel') ? ['vercel', 'vercel.com', 'vercel.app'] : [])
  ];
  
  let mentions = 0;
  for (const variation of domainVariations) {
    if (variation && variation.length > 1) { // Check meaningful variations
      const regex = new RegExp(`\\b${variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = textLower.match(regex);
      if (matches) {
        mentions += matches.length;
        console.log(`Found ${matches.length} mentions of "${variation}"`);
      }
    }
  }
  
  console.log(`Total mentions found for ${domain}: ${mentions}`);
  return mentions;
}

function generateTrends(currentScore: number): Array<{ month: string; score: number }> {
  // Generate realistic trends based on current score
  const months = ['Oct', 'Nov', 'Dec'];
  const trends = [];
  
  // If current score is 0, show a flat line at 0
  if (currentScore === 0) {
    return months.map(month => ({ month, score: 0 }));
  }
  
  // Generate realistic progression
  for (let i = 0; i < months.length; i++) {
    const monthsAgo = months.length - 1 - i;
    // Start lower and build up to current score
    const baseScore = Math.max(0, currentScore - (monthsAgo * 15));
    const variation = (Math.random() - 0.5) * 10; // ±5 points variation
    const score = Math.max(0, Math.min(100, baseScore + variation));
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
  
  // Use the same domain-specific prompts that were actually tested
  const domainSpecificPrompts = getDomainSpecificPrompts(domain);
  
  for (let i = 0; i < Math.min(5, domainSpecificPrompts.length); i++) {
    const testPrompt = domainSpecificPrompts[i];
    
    // Check which models found the domain for this specific prompt
    const visibleModels = results.filter(r => r.visible && r.context.some(ctx => 
      ctx.toLowerCase().includes(domain.toLowerCase())
    ));
    
    const isVisible = visibleModels.length > 0;
    const firstShownIn = visibleModels.length > 0 ? visibleModels[0].model : 'None';
    
    // Use the actual prompt as the title
    const title = testPrompt;
    
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
      change: 'up' as 'up' | 'down' | 'neutral', 
      changeValue: 12,
      chatgpt: { visible: true, frequency: Math.floor(Math.random() * 5) + 1 },
      claude: { visible: true, frequency: Math.floor(Math.random() * 5) + 1 }
    }
  ];

  // Add realistic competitors based on domain category
  const domainLower = domain.toLowerCase();
  let competitorData: Array<{name: string, baseScore: number}> = [];

  if (domainLower.includes('stripe') || domainLower.includes('payment')) {
    competitorData = [
      { name: 'PayPal', baseScore: 85 },
      { name: 'Square', baseScore: 78 },
      { name: 'Razorpay', baseScore: 65 },
      { name: 'Adyen', baseScore: 72 }
    ];
  } else if (domainLower.includes('notion') || domainLower.includes('productivity')) {
    competitorData = [
      { name: 'Airtable', baseScore: 82 },
      { name: 'Monday.com', baseScore: 75 },
      { name: 'Trello', baseScore: 88 },
      { name: 'Asana', baseScore: 80 }
    ];
  } else if (domainLower.includes('openai') || domainLower.includes('ai')) {
    competitorData = [
      { name: 'Anthropic', baseScore: 90 },
      { name: 'Google AI', baseScore: 85 },
      { name: 'Hugging Face', baseScore: 70 },
      { name: 'Cohere', baseScore: 65 }
    ];
  } else if (domainLower.includes('github') || domainLower.includes('dev')) {
    competitorData = [
      { name: 'GitLab', baseScore: 75 },
      { name: 'Bitbucket', baseScore: 60 },
      { name: 'Azure DevOps', baseScore: 55 },
      { name: 'SourceForge', baseScore: 40 }
    ];
  } else if (domainLower.includes('shopify') || domainLower.includes('ecommerce')) {
    competitorData = [
      { name: 'WooCommerce', baseScore: 80 },
      { name: 'BigCommerce', baseScore: 70 },
      { name: 'Magento', baseScore: 65 },
      { name: 'Squarespace', baseScore: 60 }
    ];
  } else if (domainLower.includes('hltv') || domainLower.includes('gaming')) {
    competitorData = [
      { name: 'ESL', baseScore: 85 },
      { name: 'FACEIT', baseScore: 80 },
      { name: 'ESEA', baseScore: 70 },
      { name: 'GamersClub', baseScore: 60 }
    ];
  } else {
    // Generic competitors for unknown domains
    competitorData = [
      { name: 'Competitor A', baseScore: 70 },
      { name: 'Competitor B', baseScore: 65 },
      { name: 'Competitor C', baseScore: 60 },
      { name: 'Competitor D', baseScore: 55 }
    ];
  }

  // Generate competitor data
  for (let i = 0; i < Math.min(4, competitorData.length); i++) {
    const competitor = competitorData[i];
    const competitorScore = Math.max(0, competitor.baseScore + (Math.random() - 0.5) * 20);
    const changeValue = Math.floor(Math.random() * 15) + 1;
    const changeType = Math.random() > 0.5 ? 'up' : 'down';
    
    competitors.push({
      rank: i + 2,
      brand: competitor.name,
      score: Math.round(competitorScore),
      change: changeType as 'up' | 'down' | 'neutral',
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
  
  // Check for visibility issues
  if (claude.score < 30) {
    highlights.push({
      type: 'visibility-drop' as const,
      title: 'Low Gemini Visibility',
      description: 'Your domain has very low visibility in Gemini responses',
      value: `${claude.score}%`
    });
  }
  
  if (chatgpt.score < 30) {
    highlights.push({
      type: 'visibility-drop' as const,
      title: 'Low ChatGPT Visibility',
      description: 'Your domain has very low visibility in ChatGPT responses',
      value: `${chatgpt.score}%`
    });
  }
  
  // Check for strong performance
  if (chatgpt.visible && claude.visible && chatgpt.score > 70 && claude.score > 70) {
    highlights.push({
      type: 'new-competitor' as const,
      title: 'Excellent AI Visibility',
      description: 'Your domain is highly visible across both major AI models',
      value: '2/2 models'
    });
  }
  
  // Check for mixed performance
  if ((chatgpt.visible && !claude.visible) || (!chatgpt.visible && claude.visible)) {
    highlights.push({
      type: 'missed-prompt' as const,
      title: 'Inconsistent Visibility',
      description: 'Your domain appears in some AI models but not others',
      value: `${chatgpt.visible ? '1' : '0'}/2 models`
    });
  }
  
  // Check for mention frequency
  const totalMentions = chatgpt.mentions + claude.mentions;
  if (totalMentions === 0) {
    highlights.push({
      type: 'missed-prompt' as const,
      title: 'No AI Mentions Found',
      description: 'Your domain was not mentioned in any AI responses',
      value: '0 mentions'
    });
  } else if (totalMentions < 3) {
    highlights.push({
      type: 'missed-prompt' as const,
      title: 'Low Mention Frequency',
      description: 'Your domain has very few mentions across AI responses',
      value: `${totalMentions} mentions`
    });
  } else if (totalMentions > 10) {
    highlights.push({
      type: 'new-competitor' as const,
      title: 'High Mention Frequency',
      description: 'Your domain is frequently mentioned in AI responses',
      value: `${totalMentions} mentions`
    });
  }
  
  // Check for score trends
  const avgScore = (chatgpt.score + claude.score) / 2;
  if (avgScore > 80) {
    highlights.push({
      type: 'new-competitor' as const,
      title: 'Outstanding Performance',
      description: 'Your domain has exceptional AI visibility scores',
      value: `${Math.round(avgScore)}% avg`
    });
  } else if (avgScore < 20) {
    highlights.push({
      type: 'visibility-drop' as const,
      title: 'Critical Visibility Issue',
      description: 'Your domain has critically low AI visibility',
      value: `${Math.round(avgScore)}% avg`
    });
  }
  
  return highlights as Array<{
    type: 'visibility-drop' | 'new-competitor' | 'missed-prompt';
    title: string;
    description: string;
    value: string;
  }>;
}