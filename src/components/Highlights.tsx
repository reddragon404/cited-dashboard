import { TrendingDown, Users, AlertCircle } from 'lucide-react';

interface Highlight {
  type: 'visibility-drop' | 'new-competitor' | 'missed-prompt';
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
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case 'visibility-drop':
        return 'border-red-500 bg-red-900/20';
      case 'new-competitor':
        return 'border-blue-500 bg-blue-900/20';
      case 'missed-prompt':
        return 'border-yellow-500 bg-yellow-900/20';
      default:
        return 'border-gray-500 bg-gray-800';
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-white mb-4">This Month&apos;s Highlights</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {highlights.map((highlight, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getCardColor(highlight.type)}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {getIcon(highlight.type)}
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-white">
                  {highlight.title}
                </h4>
                <p className="text-sm text-gray-400 mt-1">
                  {highlight.description}
                </p>
                {highlight.value && (
                  <p className="text-lg font-semibold text-white mt-2">
                    {highlight.value}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}