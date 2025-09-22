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
        return 'border-red-200 bg-red-50';
      case 'new-competitor':
        return 'border-blue-200 bg-blue-50';
      case 'missed-prompt':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">This Month&apos;s Highlights</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {highlights.map((highlight, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getCardColor(highlight.type)}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {getIcon(highlight.type)}
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">
                  {highlight.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {highlight.description}
                </p>
                {highlight.value && (
                  <p className="text-lg font-semibold text-gray-900 mt-2">
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