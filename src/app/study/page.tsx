'use client';

import { useState, useEffect } from 'react';
import { Chapter } from '@/types/study';
import ChapterCard from '@/components/study/ChapterCard';
import ChapterNavigation from '@/components/study/ChapterNavigation';
import { BookOpen } from 'lucide-react';

export default function StudyPage() {
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
      } else {
        console.error('Failed to load chapters');
      }
    } catch (error) {
      console.error('Error loading chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">학습 콘텐츠를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 섹션 */}
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          생성형 AI와 함께하는 국정감사 핸드북
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          생성형 AI를 활용한 국정감사 업무 효율화를 위한 실무 가이드입니다.
        </p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          체계적인 학습을 통해 프롬프트 엔지니어링 전문가가 되어보세요.
        </p>
      </div>

      {/* 챕터 네비게이션 */}
      <div className="mb-12">
        <ChapterNavigation />
      </div>

      {/* 챕터 목록 */}
      {chapters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter, idx) => (
            <ChapterCard 
              key={chapter.id} 
              chapter={chapter} 
              chapterIndex={idx}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            학습 콘텐츠를 준비 중입니다
          </h3>
          <p className="text-gray-600">
            곧 풍부한 프롬프트 엔지니어링 학습 자료를 제공할 예정입니다.
          </p>
        </div>
      )}
    </div>
  );
}
