export interface ChapterFrontmatter {
  title: string;
  chapter: number;
  description: string;
}

export interface Chapter {
  id: string;
  slug: string;
  frontmatter: ChapterFrontmatter;
  content: string;
  htmlContent: string;
  readingTime: number;
}

export interface StudyProgress {
  [chapterId: string]: {
    isCompleted: boolean;
    lastVisited: string;
    bookmarked: boolean;
  };
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children?: TableOfContentsItem[];
}