import React from 'react';
import { TrendingUp, Clock, Calendar } from 'lucide-react';
import type { MemeCategory, SortBy } from '../types/meme';
import { cn } from '../utils/utils';

interface Props {
  selectedCategory: MemeCategory | 'All';
  selectedSort: SortBy;
  onCategoryChange: (category: MemeCategory | 'All') => void;
  onSortChange: (sort: SortBy) => void;
}

const categories: (MemeCategory | 'All')[] = ['All', 'Funny', 'Cringe', 'Political', 'Wholesome', 'Dank', 'Other'];

const sortOptions: { value: SortBy; label: string; icon: React.ReactNode }[] = [
  { value: 'popularity', label: 'Popular', icon: <TrendingUp className="h-4 w-4" /> },
  { value: 'newest', label: 'Newest', icon: <Clock className="h-4 w-4" /> },
  { value: 'oldest', label: 'Oldest', icon: <Calendar className="h-4 w-4" /> },
];

export const FilterBar: React.FC<Props> = ({
  selectedCategory,
  selectedSort,
  onCategoryChange,
  onSortChange,
}) => {
  return (
    <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                  selectedCategory === category
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex space-x-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={cn(
                  "flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors",
                  selectedSort === option.value
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                )}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
