interface CompetitorTableProps {
  competitors: Array<{
    rank: number;
    brand: string;
    score: number;
    change?: 'up' | 'down' | 'neutral';
    changeValue?: number;
  }>;
}

export default function CompetitorTable({ competitors }: CompetitorTableProps) {
  const getChangeIcon = (change: string) => {
    switch (change) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  const getChangeColor = (change: string) => {
    switch (change) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-white">
          Competitor Leaderboard
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-400">
          How you rank against your competitors
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {competitors.map((competitor, index) => (
              <tr key={index} className={index === 0 ? 'bg-green-900/20' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  #{competitor.rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {competitor.brand}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {competitor.score}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {competitor.change && competitor.changeValue && (
                    <span className={`font-medium ${getChangeColor(competitor.change)}`}>
                      {getChangeIcon(competitor.change)} {competitor.changeValue}%
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}