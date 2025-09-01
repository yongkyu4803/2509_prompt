import { NextResponse } from 'next/server';
import { getChapterBySlug, getAdjacentChapters } from '@/lib/markdown';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    const [chapter, adjacent] = await Promise.all([
      getChapterBySlug(slug),
      getAdjacentChapters(slug)
    ]);

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      chapter,
      adjacent
    });
  } catch (error) {
    console.error('Failed to get chapter:', error);
    return NextResponse.json(
      { error: 'Failed to load chapter' },
      { status: 500 }
    );
  }
}