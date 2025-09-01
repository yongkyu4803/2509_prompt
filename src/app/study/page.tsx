'use client';

import { useState, useEffect } from 'react';
import { Chapter, StudyProgress } from '@/types/study';
import ChapterCard from '@/components/study/ChapterCard';
import { GraduationCap, BookOpen, Clock, Award } from 'lucide-react';

export default function StudyPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [progress, setProgress] = useState<StudyProgress>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChapters();
    loadProgress();
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

  const loadProgress = () => {
    const savedProgress = localStorage.getItem('study-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  };

  const handleMarkComplete = (chapterId: string) => {
    const newProgress = {
      ...progress,
      [chapterId]: {
        isCompleted: !progress[chapterId]?.isCompleted,
        lastVisited: new Date().toISOString(),
        bookmarked: progress[chapterId]?.bookmarked || false
      }
    };
    
    setProgress(newProgress);
    localStorage.setItem('study-progress', JSON.stringify(newProgress));
  };

  const completedCount = Object.values(progress).filter(p => p.isCompleted).length;
  const totalChapters = chapters.length;
  const completionRate = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;

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
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <GraduationCap className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          프롬프트 엔지니어링 스터디
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          생성형 AI를 활용한 국정감사 업무 효율화를 위한 실무 가이드입니다. 
          체계적인 학습을 통해 프롬프트 엔지니어링 전문가가 되어보세요.
        </p>
      </div>

      {/* 진도 현황 */}
      {totalChapters > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">학습 진도</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Award size={16} />
              <span>{completedCount}/{totalChapters} 챕터 완료</span>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>전체 진도율</span>
              <span>{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{totalChapters}</div>
              <div className="text-sm text-gray-600">총 챕터</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-gray-600">완료</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalChapters - completedCount}</div>
              <div className="text-sm text-gray-600">남은 챕터</div>
            </div>
          </div>
        </div>
      )}

      {/* 챕터 목록 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen size={20} className="text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">학습 챕터</h2>
        </div>

        {chapters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                isCompleted={progress[chapter.id]?.isCompleted || false}
                onMarkComplete={handleMarkComplete}
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

      {/* 하단 정보 */}
      <div className="text-center text-sm text-gray-500 mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-center gap-1 mb-2">
          <Clock size={14} />
          <span>전체 예상 학습 시간: {chapters.reduce((total, chapter) => total + chapter.readingTime, 0)}분</span>
        </div>
        <p>
          체계적인 학습을 통해 프롬프트 엔지니어링 전문가가 되어보세요.
        </p>
      </div>
    </div>
  );
}