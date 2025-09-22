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
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Models you&apos;re visible in</h3>
      <div className="space-y-4">
        {models.map((model, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              {model.visible ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mr-3" />
              )}
              <span className="text-sm font-medium text-gray-900">{model.name}</span>
            </div>
            {model.score && (
              <span className="text-sm text-gray-500">{model.score}% visibility</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}