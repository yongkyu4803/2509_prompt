import { BookOpen, Home } from 'lucide-react';
import Link from 'next/link';

export default function ChapterNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">챕터를 찾을 수 없습니다</h1>
        <p className="text-gray-600 mb-6">
          요청하신 챕터가 존재하지 않거나 삭제되었을 수 있습니다.
        </p>
        <Link
          href="/study"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Home size={16} />
          스터디 홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}