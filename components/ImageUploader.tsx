
import React, { useRef, useState, useCallback } from 'react';
import { CameraModal } from './CameraModal';
import { UploadIcon, CameraIcon, TrashIcon } from './icons';

interface ImageUploaderProps {
  onImageReady: (dataUrl: string) => void;
  onReset: () => void;
  currentImage: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageReady, onReset, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageReady(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleCameraCapture = useCallback((dataUrl: string) => {
    onImageReady(dataUrl);
    setIsCameraOpen(false);
  },[onImageReady]);

  if (currentImage) {
    return (
      <div className="w-full text-center">
        <div className="relative group w-full max-w-lg mx-auto border-2 border-dashed border-gray-300 rounded-lg p-2">
           <img src={currentImage} alt="Crop preview" className="w-full h-auto max-h-[50vh] object-contain rounded-md" />
           <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-md">
                <button 
                    onClick={onReset} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-600 text-white rounded-full p-3 shadow-lg hover:bg-red-700"
                    aria-label="Remove image"
                >
                    <TrashIcon className="w-6 h-6" />
                </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleUploadClick}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-white text-green-700 font-semibold rounded-lg border border-green-300 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <UploadIcon className="w-5 h-5 mr-2" />
          Upload Image
        </button>
        <span className="text-gray-500 text-sm">or</span>
        <button
          onClick={() => setIsCameraOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-white text-green-700 font-semibold rounded-lg border border-green-300 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <CameraIcon className="w-5 h-5 mr-2" />
          Use Camera
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-4">Supports JPEG, PNG, WEBP</p>
      {isCameraOpen && <CameraModal onCapture={handleCameraCapture} onClose={() => setIsCameraOpen(false)} />}
    </div>
  );
};
