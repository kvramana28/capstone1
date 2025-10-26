
import React from 'react';
import { LogoIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center">
            <LogoIcon className="h-8 w-auto text-green-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-800">
              Paddy Crop Disease Analyzer
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
