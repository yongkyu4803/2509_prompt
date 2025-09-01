'use client';

import { Chapter } from '@/types/study';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ChapterCardProps {
  chapter: Chapter;
}

export default function ChapterCard({ chapter }: ChapterCardProps) {

  return (
    <Link href={`/study/chapter/${chapter.slug}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 hover:border-purple-200 hover:-translate-y-1">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-xl font-bold text-purple-600">
                {chapter.frontmatter.chapter}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xl leading-tight mb-1">
                {chapter.frontmatter.title}
              </h3>
              <p className="text-sm text-gray-500">
                Chapter {chapter.frontmatter.chapter}
              </p>
            </div>
          </div>

          {/* 화살표 아이콘 */}
          <div className="text-gray-400 group-hover:text-purple-600 transition-colors">
            <ArrowRight size={24} />
          </div>
        </div>

        {/* 설명 */}
        <p className="text-gray-700 leading-relaxed mb-6 line-clamp-3">
          {chapter.frontmatter.description}
        </p>

        {/* 메타 정보 */}
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{chapter.readingTime}분</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={16} />
            <span>학습 가이드</span>
          </div>
        </div>
      </div>
    </Link>
  );
}