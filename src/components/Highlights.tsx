import { TrendingDown, TrendingUp, Users, AlertCircle, CheckCircle, XCircle, Target } from 'lucide-react';

interface Highlight {
  type: 'visibility-drop' | 'new-competitor' | 'missed-prompt' | 'excellent-performance' | 'critical-issue' | 'outstanding-performance';
  title: string;
  description: string;
  value?: string;
}

interface HighlightsProps {
  highlights: Highlight[];
}

export default function Highlights({ highlights }: HighlightsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'visibility-drop':
        return <TrendingDown className="h-6 w-6 text-red-500" />;
      case 'new-competitor':
        return <Users className="h-6 w-6 text-blue-500" />;
      case 'missed-prompt':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      case 'excellent-performance':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'critical-issue':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'outstanding-performance':
        return <Target className="h-6 w-6 text-purple-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case 'visibility-drop':
        return 'border-red-500/50 bg-red-900/10 hover:bg-red-900/20';
      case 'new-competitor':
        return 'border-blue-500/50 bg-blue-900/10 hover:bg-blue-900/20';
      case 'missed-prompt':
        return 'border-yellow-500/50 bg-yellow-900/10 hover:bg-yellow-900/20';
      case 'excellent-performance':
        return 'border-green-500/50 bg-green-900/10 hover:bg-green-900/20';
      case 'critical-issue':
        return 'border-red-500/50 bg-red-900/10 hover:bg-red-900/20';
      case 'outstanding-performance':
        return 'border-purple-500/50 bg-purple-900/10 hover:bg-purple-900/20';
      default:
        return 'border-gray-500/50 bg-gray-800/50 hover:bg-gray-700/50';
    }
  };

  const getPriority = (type: string) => {
    switch (type) {
      case 'critical-issue':
        return 'High Priority';
      case 'visibility-drop':
        return 'Medium Priority';
      case 'missed-prompt':
        return 'Medium Priority';
      case 'excellent-performance':
        return 'Good News';
      case 'outstanding-performance':
        return 'Excellent';
      case 'new-competitor':
        return 'Info';
      default:
        return 'Info';
    }
  };

  if (highlights.length === 0) {
    return (
      <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">AI Visibility Insights</h3>
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No significant insights to highlight at this time.</p>
          <p className="text-sm text-gray-500 mt-2">Run more searches to generate insights about your AI visibility.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">AI Visibility Insights</h3>
        <div className="text-sm text-gray-400">
          {highlights.length} insight{highlights.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((highlight, index) => (
          <div key={index} className={`p-4 rounded-lg border transition-all duration-200 ${getCardColor(highlight.type)}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon(highlight.type)}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-white">
                    {highlight.title}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    highlight.type.includes('critical') || highlight.type.includes('drop') 
                      ? 'bg-red-900/30 text-red-300' 
                      : highlight.type.includes('excellent') || highlight.type.includes('outstanding')
                      ? 'bg-green-900/30 text-green-300'
                      : 'bg-blue-900/30 text-blue-300'
                  }`}>
                    {getPriority(highlight.type)}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-2">
                  {highlight.description}
                </p>
                {highlight.value && (
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-white">
                      {highlight.value}
                    </span>
                    {highlight.type.includes('score') && (
                      <span className="ml-1 text-xs text-gray-400">/100</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}