"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/authClient';
import Layout from '@/components/Layout';
import ScoreCard from '@/components/ScoreCard';
import TrendGraph from '@/components/TrendGraph';
import ModelVisibility from '@/components/ModelVisibility';
import PromptList from '@/components/PromptList';
import CompetitorTable from '@/components/CompetitorTable';
import Highlights from '@/components/Highlights';
import { 
  trendData, 
  modelVisibility, 
  topPrompts, 
  competitorData, 
  highlights 
} from '@/lib/dummyData';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState<any>(null);
  const [searchedDomain, setSearchedDomain] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { success, user } = await getCurrentUser();
      if (!success || !user) {
        router.push('/');
        return;
      }
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [router]);

  useEffect(() => {
    // Check for search results in localStorage
    const storedResults = localStorage.getItem('searchResults');
    const storedDomain = localStorage.getItem('searchedDomain');
    
    if (storedResults && storedDomain) {
      try {
        const parsedData = JSON.parse(storedResults);
        setSearchData(parsedData);
        setSearchedDomain(storedDomain);
      } catch (error) {
        console.error('Error parsing search results:', error);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {searchedDomain ? `${searchedDomain} - AI Visibility Report` : 'Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {searchedDomain 
              ? `AI visibility analysis for ${searchedDomain}`
              : 'Track your AI visibility across different models and competitors'
            }
          </p>
          {searchData && (
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Real AI Data
            </div>
          )}
        </div>

        {/* AI Visibility Score */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <ScoreCard
              score={searchData?.overallScore || 85}
              title="AI Visibility Score"
              subtitle="Out of 100"
              trend="up"
              trendValue={12}
            />
          </div>
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <ScoreCard
              score={searchData?.models?.chatgpt?.score || 72}
              title="ChatGPT Visibility"
              subtitle="Last 30 days"
              trend="up"
              trendValue={8}
            />
          </div>
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <ScoreCard
              score={searchData?.models?.claude?.score || 68}
              title="Gemini Visibility"
              subtitle="Last 30 days"
              trend="down"
              trendValue={3}
            />
          </div>
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <ScoreCard
              score={searchData?.models?.perplexity?.score || 0}
              title="Perplexity Visibility"
              subtitle="Last 30 days"
              trend="down"
              trendValue={15}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Visibility Trend */}
          <div className="lg:col-span-2">
            <TrendGraph 
              data={searchData?.trends || trendData} 
              title="Visibility Trend (Last 3 Months)" 
            />
          </div>

          {/* Models Visibility */}
          <div>
            <ModelVisibility 
              models={searchData?.models ? [
                { name: 'ChatGPT', visible: searchData.models.chatgpt.visible, score: searchData.models.chatgpt.score },
                { name: 'Gemini', visible: searchData.models.claude.visible, score: searchData.models.claude.score },
                { name: 'Perplexity', visible: searchData.models.perplexity.visible, score: searchData.models.perplexity.score }
              ] : modelVisibility} 
            />
          </div>

          {/* Top Prompts */}
          <div>
            <PromptList prompts={searchData?.prompts || topPrompts} />
          </div>

          {/* Competitor Leaderboard */}
          <div className="lg:col-span-2">
            <CompetitorTable competitors={searchData?.competitors || competitorData} />
          </div>

          {/* Highlights */}
          <div className="lg:col-span-2">
            <Highlights highlights={searchData?.highlights || highlights} />
          </div>
        </div>
      </div>
    </Layout>
  );
}