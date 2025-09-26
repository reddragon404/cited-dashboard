import { CheckCircle, XCircle } from 'lucide-react';

interface ModelVisibilityProps {
  models: Array<{
    name: string;
    visible: boolean;
    score?: number;
  }>;
}

export default function ModelVisibility({ models }: ModelVisibilityProps) {
  return (
    <div className="bg-gray-900/50 p-6 rounded-lg shadow border border-gray-700">
      <h3 className="text-lg font-medium text-white mb-4">Models you&apos;re visible in</h3>
      <div className="space-y-4">
        {models.map((model, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              {model.visible ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mr-3" />
              )}
              <span className="text-sm font-medium text-white">{model.name}</span>
            </div>
            {model.score && (
              <span className="text-sm text-gray-400">{model.score}% visibility</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}