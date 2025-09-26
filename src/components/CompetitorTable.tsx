"use client";
import { useState } from 'react';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [newScore, setNewScore] = useState('');

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompetitor.trim() && newScore.trim()) {
      // In a real app, this would add to the database
      // For now, we'll just show a success message
      alert(`Added ${newCompetitor} with score ${newScore} to competitors`);
      setNewCompetitor('');
      setNewScore('');
      setShowAddForm(false);
    }
  };
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
    <div className="bg-gray-800/50 border border-gray-700 shadow-lg overflow-hidden sm:rounded-lg">
      <div className="px-6 py-5 sm:px-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl leading-6 font-bold text-white">
              Competitor Leaderboard
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-300">
              How you rank against your competitors in AI visibility
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + Add Competitor
          </button>
        </div>
        
        {showAddForm && (
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <form onSubmit={handleAddCompetitor} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Competitor Name
                </label>
                <input
                  type="text"
                  value={newCompetitor}
                  onChange={(e) => setNewCompetitor(e.target.value)}
                  placeholder="e.g., competitor.com"
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Score
                </label>
                <input
                  type="number"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  placeholder="85"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                AI Visibility Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800/30 divide-y divide-gray-700">
            {competitors.map((competitor, index) => (
              <tr key={index} className={index === 0 ? 'bg-blue-900/20 border-l-4 border-l-blue-500' : 'hover:bg-gray-700/30'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                  #{competitor.rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                  {competitor.brand}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <span className={`text-lg font-bold ${
                      competitor.score >= 80 ? 'text-green-400' :
                      competitor.score >= 60 ? 'text-yellow-400' :
                      competitor.score >= 40 ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {competitor.score}
                    </span>
                    <span className="ml-2 text-gray-400 text-xs">/100</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {competitor.change && competitor.changeValue ? (
                    <span className={`font-medium ${getChangeColor(competitor.change)}`}>
                      {getChangeIcon(competitor.change)} {competitor.changeValue}%
                    </span>
                  ) : (
                    <span className="text-gray-500">—</span>
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