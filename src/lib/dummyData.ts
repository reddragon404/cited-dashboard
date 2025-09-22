// Dummy data for the Cited dashboard

export const trendData = [
  { month: 'Oct', score: 72 },
  { month: 'Nov', score: 78 },
  { month: 'Dec', score: 85 },
];

export const modelVisibility = [
  { name: 'ChatGPT', visible: true, score: 85 },
  { name: 'Claude', visible: true, score: 72 },
  { name: 'Perplexity', visible: false, score: 0 },
];

export const topPrompts = [
  {
    title: 'Best project management tools for startups',
    status: 'visible' as const,
    firstShownIn: 'ChatGPT',
    dateChecked: '2024-01-15'
  },
  {
    title: 'AI-powered customer service solutions',
    status: 'visible' as const,
    firstShownIn: 'Claude',
    dateChecked: '2024-01-14'
  },
  {
    title: 'Top SaaS companies in 2024',
    status: 'not-visible' as const,
    firstShownIn: 'ChatGPT',
    dateChecked: '2024-01-13'
  },
  {
    title: 'Best productivity apps for remote teams',
    status: 'visible' as const,
    firstShownIn: 'ChatGPT',
    dateChecked: '2024-01-12'
  },
  {
    title: 'Leading CRM software comparison',
    status: 'not-visible' as const,
    firstShownIn: 'Claude',
    dateChecked: '2024-01-11'
  }
];

export const competitorData = [
  { rank: 1, brand: 'Your Brand', score: 85, change: 'up' as const, changeValue: 12 },
  { rank: 2, brand: 'Competitor A', score: 78, change: 'down' as const, changeValue: 5 },
  { rank: 3, brand: 'Competitor B', score: 72, change: 'up' as const, changeValue: 3 },
  { rank: 4, brand: 'Competitor C', score: 68, change: 'neutral' as const, changeValue: 0 },
  { rank: 5, brand: 'Competitor D', score: 65, change: 'down' as const, changeValue: 8 },
];

export const highlights = [
  {
    type: 'visibility-drop' as const,
    title: 'Visibility Drop',
    description: 'Your visibility in Perplexity decreased this month',
    value: '-15%'
  },
  {
    type: 'new-competitor' as const,
    title: 'New Competitor',
    description: 'Competitor E entered the market and is gaining traction',
    value: '+23%'
  },
  {
    type: 'missed-prompt' as const,
    title: 'Missed Prompt',
    description: 'You were not mentioned in 3 high-value prompts this week',
    value: '3 prompts'
  }
];

export const allPrompts = [
  {
    title: 'Best project management tools for startups',
    status: 'visible' as const,
    firstShownIn: 'ChatGPT',
    dateChecked: '2024-01-15'
  },
  {
    title: 'AI-powered customer service solutions',
    status: 'visible' as const,
    firstShownIn: 'Claude',
    dateChecked: '2024-01-14'
  },
  {
    title: 'Top SaaS companies in 2024',
    status: 'not-visible' as const,
    firstShownIn: 'ChatGPT',
    dateChecked: '2024-01-13'
  },
  {
    title: 'Best productivity apps for remote teams',
    status: 'visible' as const,
    firstShownIn: 'ChatGPT',
    dateChecked: '2024-01-12'
  },
  {
    title: 'Leading CRM software comparison',
    status: 'not-visible' as const,
    firstShownIn: 'Claude',
    dateChecked: '2024-01-11'
  },
  {
    title: 'Best email marketing platforms',
    status: 'visible' as const,
    firstShownIn: 'ChatGPT',
    dateChecked: '2024-01-10'
  },
  {
    title: 'Top analytics tools for businesses',
    status: 'not-visible' as const,
    firstShownIn: 'Claude',
    dateChecked: '2024-01-09'
  },
  {
    title: 'Best collaboration software for teams',
    status: 'visible' as const,
    firstShownIn: 'ChatGPT',
    dateChecked: '2024-01-08'
  }
];

export const competitorComparison = [
  {
    competitor: 'Competitor A',
    chatgpt: { visible: true, frequency: 12 },
    claude: { visible: true, frequency: 8 },
    perplexity: { visible: false, frequency: 0 },
    change: 'down' as const,
    changeValue: 5
  },
  {
    competitor: 'Competitor B',
    chatgpt: { visible: true, frequency: 10 },
    claude: { visible: true, frequency: 6 },
    perplexity: { visible: true, frequency: 4 },
    change: 'up' as const,
    changeValue: 3
  },
  {
    competitor: 'Competitor C',
    chatgpt: { visible: true, frequency: 8 },
    claude: { visible: false, frequency: 0 },
    perplexity: { visible: true, frequency: 2 },
    change: 'neutral' as const,
    changeValue: 0
  },
  {
    competitor: 'Competitor D',
    chatgpt: { visible: true, frequency: 6 },
    claude: { visible: true, frequency: 4 },
    perplexity: { visible: false, frequency: 0 },
    change: 'down' as const,
    changeValue: 8
  }
];