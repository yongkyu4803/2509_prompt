import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Chapter, ChapterFrontmatter, TableOfContentsItem } from '@/types/study';

// 한글을 포함한 문자열을 URL-safe ID로 변환하는 함수
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '') // 특수문자 제거 (한글 유지)
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/^-+|-+$/g, ''); // 앞뒤 하이픈 제거
}

// 제목에 ID를 추가하는 플러그인
interface MarkdownNode {
  type: string;
  children?: MarkdownNode[];
  value?: string;
  data?: Record<string, unknown>;
  properties?: Record<string, unknown>;
}

function addHeadingIds() {
  return (tree: MarkdownNode) => {
    if (tree.children) {
      tree.children.forEach((node: MarkdownNode) => {
        if (node.type === 'heading' && node.children && node.children[0]) {
          const text = node.children
            .filter((child: MarkdownNode) => child.type === 'text')
            .map((child: MarkdownNode) => child.value)
          .join(' ');
        
          if (text) {
            const id = createSlug(text);
            node.data = node.data || {};
            node.data.hProperties = node.data.hProperties || {};
            (node.data.hProperties as Record<string, string>).id = id;
          }
        }
      });
    }
  };
}

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * 모든 챕터 목록을 가져옵니다
 */
export async function getAllChapters(): Promise<Chapter[]> {
  try {
    const fileNames = fs.readdirSync(contentDirectory);
    const chapters: Chapter[] = [];

    for (const fileName of fileNames) {
      if (fileName.endsWith('.md')) {
        const slug = fileName.replace(/\.md$/, '');
        const chapter = await getChapterBySlug(slug);
        if (chapter) {
          chapters.push(chapter);
        }
      }
    }

    // 챕터 번호로 정렬
    return chapters.sort((a, b) => a.frontmatter.chapter - b.frontmatter.chapter);
  } catch (error) {
    console.error('Failed to load chapters:', error);
    return [];
  }
}

/**
 * 특정 챕터를 가져옵니다
 */
export async function getChapterBySlug(slug: string): Promise<Chapter | null> {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // 마크다운을 HTML로 변환
    const processedContent = await remark()
      .use(remarkGfm)
      .use(remarkBreaks)
      .use(addHeadingIds)
      .use(remarkHtml, { sanitize: false })
      .process(content);

    const htmlContent = processedContent.toString();

    // 대략적인 읽기 시간 계산 (한국어 기준: 분당 300자)
    const readingTime = Math.ceil(content.length / 300);

    return {
      id: slug,
      slug,
      frontmatter: data as ChapterFrontmatter,
      content,
      htmlContent,
      readingTime
    };
  } catch (error) {
    console.error(`Failed to load chapter ${slug}:`, error);
    return null;
  }
}

/**
 * 마크다운 콘텐츠에서 목차를 생성합니다
 */
export function generateTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = createSlug(title);

    toc.push({
      id,
      title,
      level,
    });
  }

  return toc;
}

/**
 * 챕터 슬러그 목록을 가져옵니다 (static generation용)
 */
export function getChapterSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(contentDirectory);
    return fileNames
      .filter(name => name.endsWith('.md'))
      .map(name => name.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Failed to get chapter slugs:', error);
    return [];
  }
}

/**
 * 다음/이전 챕터 정보를 가져옵니다
 */
export async function getAdjacentChapters(currentSlug: string) {
  const allChapters = await getAllChapters();
  const currentIndex = allChapters.findIndex(chapter => chapter.slug === currentSlug);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? allChapters[currentIndex - 1] : null,
    next: currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null
  };
}