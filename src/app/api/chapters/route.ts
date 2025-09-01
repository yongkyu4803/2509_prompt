import { NextResponse } from 'next/server';
import { getAllChapters } from '@/lib/markdown';

export async function GET() {
  try {
    const chapters = await getAllChapters();
    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Failed to get chapters:', error);
    return NextResponse.json(
      { error: 'Failed to load chapters' },
      { status: 500 }
    );
  }
}