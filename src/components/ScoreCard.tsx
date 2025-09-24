interface ScoreCardProps {
  score: number;
  title: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
}

export default function ScoreCard({ score, title, subtitle, trend, trendValue }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-400 truncate">
                {title}
              </dt>
              {subtitle && (
                <dd className="text-lg font-medium text-white">
                  {subtitle}
                </dd>
              )}
            </dl>
          </div>
        </div>
        {trend && trendValue && (
          <div className="mt-4">
            <div className="flex items-center text-sm">
              <span className={`font-medium ${getTrendColor(trend)}`}>
                {getTrendIcon(trend)} {trendValue}%
              </span>
              <span className="ml-2 text-gray-400">vs last month</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}