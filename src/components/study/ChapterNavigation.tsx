'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Chapter } from '@/types/study';

interface ChapterNavigationProps {
  currentChapterId?: string;
}

export default function ChapterNavigation({ currentChapterId }: ChapterNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    try {
      const response = await fetch('/api/chapters');
      if (response.ok) {
        const data = await response.json();
        setChapters(data);
      }
    } catch (error) {
      console.error('Error loading chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = (chapterSlug: string) => {
    router.push(`/study/chapter/${chapterSlug}`);
  };

  const isOnStudyMainPage = pathname === '/study';

  if (loading || chapters.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 justify-center overflow-x-auto">
          {/* 스터디 홈 버튼 */}
          <button
            onClick={() => router.push('/study')}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isOnStudyMainPage
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            홈
          </button>

          {/* 구분선 */}
          <div className="w-px h-6 bg-gray-300 flex-shrink-0"></div>

          {/* 챕터 버튼들 */}
          {chapters.map((chapter) => {
            const isActive = currentChapterId === chapter.id;
            
            return (
              <button
                key={chapter.id}
                onClick={() => handleChapterClick(chapter.slug)}
                className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50 border border-gray-200'
                }`}
                title={chapter.frontmatter.title}
              >
                {chapter.frontmatter.chapter}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}