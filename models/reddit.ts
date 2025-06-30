export interface RedditPost {
  kind: string;
  data: PostData;
}

export interface Preview {
  images: PreviewImage[];
}

export interface PreviewImage {
  source: PreviewSource;
}

export interface PreviewSource {
  url: string;
  width: number;
  height: number;
}

export interface Preview {
  images: PreviewImage[];
}

export interface PreviewImage {
  source: PreviewSource;
}

export interface PreviewSource {
  url: string;
  width: number;
  height: number;
}

export interface PostData {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  url: string;
  ups: number;
  downs: number;
  created: number;
  selftext: string;
  thumbnail: string;
  preview?: Preview;
  gallery_data?: GalleryData;
  media_metadata?: Record<string, MediaMetadata>;
}

export interface GalleryData {
  items: GalleryItem[];
}

export interface GalleryItem {
  media_id: string;
  id: number;
}

export interface MediaMetadata {
  status: string;
  e: string;
  m: string;
  s: MediaSource;
}

export interface MediaSource {
  u: string;
  x: number;
  y: number;
}
