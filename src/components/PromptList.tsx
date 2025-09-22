interface PromptListProps {
  prompts: Array<{
    title: string;
    status: 'visible' | 'not-visible';
    firstShownIn: string;
    dateChecked: string;
  }>;
}

export default function PromptList({ prompts }: PromptListProps) {
  const getStatusColor = (status: string) => {
    return status === 'visible' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusText = (status: string) => {
    return status === 'visible' ? 'Visible' : 'Not Visible';
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Top 5 prompts where you're included
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Recent prompts that mention your brand
        </p>
      </div>
      <ul className="divide-y divide-gray-200">
        {prompts.map((prompt, index) => (
          <li key={index} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {prompt.title}
                </p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="mr-4">First shown in: {prompt.firstShownIn}</span>
                  <span>Checked: {prompt.dateChecked}</span>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(prompt.status)}`}>
                  {getStatusText(prompt.status)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}