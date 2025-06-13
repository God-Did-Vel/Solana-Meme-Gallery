import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Zap, Upload } from 'lucide-react';

interface Props {
  onUploadClick: () => void;
}

export const Header: React.FC<Props> = ({ onUploadClick }) => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-purple-500" />
            <h1 className="text-2xl font-bold text-white">
              Solana <span className="text-purple-500">Meme</span> Gallery
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onUploadClick}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Meme</span>
            </button>
            <WalletMultiButton className="!bg-gray-800 !text-white hover:!bg-gray-700" />
          </div>
        </div>
      </div>
    </header>
  );
};
