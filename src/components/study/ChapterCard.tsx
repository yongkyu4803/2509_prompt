'use client';

import { Chapter } from '@/types/study';
import { Clock, BookOpen, CheckCircle, Circle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ChapterCardProps {
  chapter: Chapter;
  isCompleted?: boolean;
  onMarkComplete?: (chapterId: string) => void;
}

export default function ChapterCard({ chapter, isCompleted = false, onMarkComplete }: ChapterCardProps) {
  const handleMarkComplete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMarkComplete?.(chapter.id);
  };

  return (
    <Link href={`/study/chapter/${chapter.slug}`} className="block">
      <div className={cn(
        'bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200',
        'hover:border-purple-200 hover:-translate-y-1',
        isCompleted && 'bg-green-50 border-green-200'
      )}>
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              isCompleted 
                ? 'bg-green-100 text-green-600' 
                : 'bg-purple-100 text-purple-600'
            )}>
              <span className="text-lg font-bold">
                {chapter.frontmatter.chapter}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                {chapter.frontmatter.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Chapter {chapter.frontmatter.chapter}
              </p>
            </div>
          </div>

          {/* 완료 상태 토글 */}
          <button
            onClick={handleMarkComplete}
            className={cn(
              'p-2 rounded-full transition-colors',
              isCompleted
                ? 'text-green-600 hover:bg-green-100'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            )}
            title={isCompleted ? '완료됨' : '완료로 표시'}
          >
            {isCompleted ? (
              <CheckCircle size={20} className="fill-current" />
            ) : (
              <Circle size={20} />
            )}
          </button>
        </div>

        {/* 설명 */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
          {chapter.frontmatter.description}
        </p>

        {/* 메타 정보 */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{chapter.readingTime}분</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen size={12} />
              <span>학습 가이드</span>
            </div>
          </div>
          
          {isCompleted && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle size={12} />
              <span>완료</span>
            </div>
          )}
        </div>

        {/* 프로그레스 바 (완료된 경우) */}
        {isCompleted && (
          <div className="mt-4">
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full w-full transition-all duration-300"></div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}