'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Chapter, StudyProgress, TableOfContentsItem } from '@/types/study';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';
import TableOfContents from '@/components/study/TableOfContents';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  Circle,
} from 'lucide-react';
import Link from 'next/link';

interface ChapterDetailClientProps {
  chapter: Chapter;
  adjacentChapters: {
    prev: Chapter | null;
    next: Chapter | null;
  };
  toc: TableOfContentsItem[];
}

export default function ChapterDetailClient({ chapter, adjacentChapters, toc }: ChapterDetailClientProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<StudyProgress>({});

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('study-progress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    }
  };

  const handleMarkComplete = () => {
    if (typeof window === 'undefined') return;
    
    const newProgress = {
      ...progress,
      [chapter.id]: {
        isCompleted: !progress[chapter.id]?.isCompleted,
        lastVisited: new Date().toISOString(),
        bookmarked: progress[chapter.id]?.bookmarked || false
      }
    };
    
    setProgress(newProgress);
    localStorage.setItem('study-progress', JSON.stringify(newProgress));
  };

  const navigateToChapter = (targetSlug: string) => {
    router.push(`/study/chapter/${targetSlug}`);
  };

  const isCompleted = progress[chapter.id]?.isCompleted || false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 브레드크럼 네비게이션 */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/study" className="hover:text-purple-600 transition-colors">
          스터디
        </Link>
        <span>/</span>
        <span>Chapter {chapter.frontmatter.chapter}</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">{chapter.frontmatter.title}</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        {/* 마크다운 콘텐츠 */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <MarkdownRenderer htmlContent={chapter.htmlContent} />
        </div>

        {/* 네비게이션 */}
        <div className="flex items-center justify-between">
          {adjacentChapters.prev ? (
            <button
              onClick={() => navigateToChapter(adjacentChapters.prev!.slug)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ArrowLeft size={16} />
              <div className="text-left">
                <div className="text-sm text-gray-500">이전 챕터</div>
                <div className="font-medium">{adjacentChapters.prev.frontmatter.title}</div>
              </div>
            </button>
          ) : (
            <div></div>
          )}

          {adjacentChapters.next ? (
            <button
              onClick={() => navigateToChapter(adjacentChapters.next!.slug)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors text-right"
            >
              <div className="text-right">
                <div className="text-sm text-gray-500">다음 챕터</div>
                <div className="font-medium">{adjacentChapters.next.frontmatter.title}</div>
              </div>
              <ArrowRight size={16} />
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}