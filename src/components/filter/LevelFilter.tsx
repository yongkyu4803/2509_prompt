'use client';

import React from 'react';
import { getSortedCategories } from '@/lib/level-categories';

interface LevelFilterProps {
  selectedLevel: string | 'all';
  onLevelChange: (level: string | 'all') => void;
  promptCounts?: Record<string, number>;
}

export default function LevelFilter({ 
  selectedLevel, 
  onLevelChange, 
  promptCounts = {} 
}: LevelFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* 전체 버튼 */}
      <button
        onClick={() => onLevelChange('all')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          selectedLevel === 'all'
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        전체
        {Object.values(promptCounts).reduce((sum, count) => sum + count, 0) > 0 && (
          <span className="ml-1 text-xs opacity-70">
            ({Object.values(promptCounts).reduce((sum, count) => sum + count, 0)})
          </span>
        )}
      </button>

      {/* 레벨별 버튼 */}
      {getSortedCategories().map(level => {
        const count = promptCounts[level.id] || 0;
        
        return (
          <button
            key={level.id}
            onClick={() => onLevelChange(level.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedLevel === level.id
                ? `${level.bgColor} ${level.color} border-2 ${level.borderColor}`
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-base">{level.icon}</span>
            <span>{level.label}</span>
            {count > 0 && (
              <span className="text-xs opacity-70">
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}