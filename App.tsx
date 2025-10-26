
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { Spinner } from './components/Spinner';
import { analyzeCropImage } from './services/geminiService';
import type { Analysis } from './types';
import { LeafIcon } from './components/icons';

const App: React.FC = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageReady = useCallback((dataUrl: string) => {
    setImageData(dataUrl);
    setAnalysis(null);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imageData) {
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // The base64 string from data URL is "data:image/jpeg;base64,....", we need to remove the prefix
      const base64String = imageData.split(',')[1];
      const result = await analyzeCropImage(base64String);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [imageData]);
  
  const handleReset = useCallback(() => {
    setImageData(null);
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  }, []);


  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-200">
          {!imageData && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Paddy Health Analysis</h2>
              <p className="text-gray-600 mb-6">Upload a photo of your paddy crop or use your camera to get an instant AI-powered health report.</p>
            </div>
          )}

          <ImageUploader onImageReady={handleImageReady} onReset={handleReset} currentImage={imageData}/>

          {imageData && !analysis && !isLoading && (
            <div className="text-center mt-6">
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <LeafIcon className="w-5 h-5 mr-2"/>
                Analyze Crop
              </button>
            </div>
          )}

          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center text-center">
              <Spinner />
              <p className="text-gray-600 font-medium mt-4">Analyzing your crop... This may take a moment.</p>
            </div>
          )}

          {error && (
             <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
               <strong>Error:</strong> {error}
             </div>
          )}

          {analysis && (
             <AnalysisResult data={analysis} />
          )}
        </div>
      </main>
      <footer className="text-center py-4">
          <p className="text-sm text-gray-500">Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
