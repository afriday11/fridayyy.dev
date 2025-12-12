export type GalleryFrontmatter = {
  title: string;
  description?: string;
  thumbnail: string;
  categories: string[];
  url?: string;
  priority?: number;
  hidden?: boolean;
};

export type GalleryPostLike = {
  url: string;
  frontmatter: GalleryFrontmatter;
};


