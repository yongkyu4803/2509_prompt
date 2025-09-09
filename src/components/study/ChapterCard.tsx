'use client';

import { Chapter } from '@/types/study';
import { BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface ChapterCardProps {
  chapter: Chapter;
  chapterIndex: number;
}

export default function ChapterCard({ chapter, chapterIndex }: ChapterCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/study/chapter/${chapter.slug}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-purple-200 hover:-translate-y-1">
        {/* 이미지 섹션 */}
        <div className="relative h-48 bg-gray-100">
          {imageError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <BookOpen className="w-12 h-12 mb-2" />
              <span className="text-sm font-medium">Chapter {chapterIndex + 1}</span>
            </div>
          ) : (
            <Image
              src={`/study/chapter-${chapterIndex + 1}.png`}
              alt={`${chapter.frontmatter.title} thumbnail`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* 콘텐츠 섹션 */}
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-lg font-bold text-purple-600">
                  {chapter.frontmatter.chapter}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-purple-600 text-lg leading-tight mb-1 group-hover:text-purple-700 transition-colors">
                  {chapter.frontmatter.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Chapter {chapter.frontmatter.chapter}
                </p>
              </div>
            </div>

            {/* 화살표 아이콘 */}
            <div className="text-gray-400 group-hover:text-purple-600 transition-colors">
              <ArrowRight size={20} />
            </div>
          </div>

          {/* 설명 */}
          <p className="text-gray-700 leading-relaxed line-clamp-3">
            {chapter.frontmatter.description}
          </p>
        </div>
      </div>
    </Link>
  );
}