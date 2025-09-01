import { notFound } from 'next/navigation';
import { getChapterBySlug, getAdjacentChapters, generateTableOfContents } from '@/lib/markdown';
import ChapterDetailClient from '@/components/study/ChapterDetailClient';

interface ChapterPageProps {
  params: { slug: string };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params;

  // 서버에서 챕터 데이터 로드
  const chapter = await getChapterBySlug(slug);
  if (!chapter) {
    notFound();
  }

  const adjacentChapters = await getAdjacentChapters(slug);
  const toc = generateTableOfContents(chapter.content);

  return (
    <ChapterDetailClient 
      chapter={chapter}
      adjacentChapters={adjacentChapters}
      toc={toc}
    />
  );
}