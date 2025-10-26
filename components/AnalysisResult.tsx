
import React from 'react';
import type { Analysis, Pesticide } from '../types';
import { CheckCircleIcon, ExclamationIcon, BeakerIcon, SparklesIcon } from './icons';

interface AnalysisResultProps {
  data: Analysis;
}

const ConfidenceMeter: React.FC<{ score: number }> = ({ score }) => {
  const percentage = Math.round(score * 100);
  const color = percentage > 75 ? 'bg-green-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-red-500';
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const ResultCard: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-3">
            {icon}
            <h3 className="ml-3 text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="text-gray-600 space-y-2">
            {children}
        </div>
    </div>
);

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  const isHealthy = data.diseaseName.toLowerCase() === 'healthy';

  if (isHealthy) {
      return (
        <div className="mt-8 text-center p-6 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
            <div className="flex items-center justify-center">
                <CheckCircleIcon className="w-12 h-12 text-green-600" />
                <div className="ml-4 text-left">
                    <h2 className="text-2xl font-bold text-green-800">Crop is Healthy!</h2>
                    <p className="text-green-700 mt-1">{data.analysis}</p>
                </div>
            </div>
        </div>
      )
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">{data.diseaseName}</h2>
        <div className="mt-2 max-w-2xl mx-auto">
            <p className="text-sm text-gray-500 mb-1">Confidence Score: {Math.round(data.confidenceScore * 100)}%</p>
            <ConfidenceMeter score={data.confidenceScore} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResultCard title="Analysis" icon={<ExclamationIcon className="w-6 h-6 text-yellow-500" />}>
          <p>{data.analysis}</p>
        </ResultCard>

        <ResultCard title="Organic Alternatives" icon={<SparklesIcon className="w-6 h-6 text-green-500" />}>
          {data.organicAlternatives.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {data.organicAlternatives.map((alt, index) => (
                <li key={index}>{alt}</li>
              ))}
            </ul>
          ) : <p>No organic alternatives suggested.</p>}
        </ResultCard>
      </div>

       <ResultCard title="Pesticide Recommendations" icon={<BeakerIcon className="w-6 h-6 text-red-500" />}>
        {data.pesticideRecommendations.length > 0 ? (
            <div className="space-y-4">
                {data.pesticideRecommendations.map((p, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                        <p className="font-semibold text-gray-700">{p.name}</p>
                        <p className="text-sm"><span className="font-medium">Dosage:</span> {p.dosage}</p>
                        <p className="text-sm"><span className="font-medium">Application:</span> {p.application}</p>
                    </div>
                ))}
            </div>
        ): <p>No specific pesticides recommended.</p>}
       </ResultCard>

    </div>
  );
};
