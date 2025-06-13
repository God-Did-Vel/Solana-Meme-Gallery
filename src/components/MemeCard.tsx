import React from 'react';
import { ArrowUp, ArrowDown, Clock, User } from 'lucide-react';
import type { Meme } from '../types/meme';
import { cn } from '../utils/utils';

interface Props {
  meme: Meme;
  onVote: (memeId: string, voteType: 'up' | 'down') => void;
  isVoting: boolean;
}

export const MemeCard: React.FC<Props> = ({ meme, onVote, isVoting }) => {
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getScoreColor = (score: number) => {
    if (score > 20) return 'text-green-400';
    if (score > 0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const score = meme.upvotes - meme.downvotes;

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={meme.imageUrl}
          alt={meme.title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x400/1a1a1a/ffffff?text=Meme+Image';
          }}
        />
        <div className="absolute top-3 right-3">
          <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {meme.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {meme.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{meme.creator}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{formatTimeAgo(meme.timestamp)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onVote(meme.id, 'up')}
              disabled={isVoting}
              className={cn(
                "flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors",
                meme.userVote === 'up'
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600",
                isVoting && "opacity-50 cursor-not-allowed"
              )}
            >
              <ArrowUp className="h-4 w-4" />
              <span>{meme.upvotes}</span>
            </button>
            
            <button
              onClick={() => onVote(meme.id, 'down')}
              disabled={isVoting}
              className={cn(
                "flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors",
                meme.userVote === 'down'
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600",
                isVoting && "opacity-50 cursor-not-allowed"
              )}
            >
              <ArrowDown className="h-4 w-4" />
              <span>{meme.downvotes}</span>
            </button>
          </div>
          
          <div className={cn("font-semibold", getScoreColor(score))}>
            {score > 0 ? '+' : ''}{score}
          </div>
        </div>
      </div>
    </div>
  );
};
