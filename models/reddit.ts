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
}

export interface RedditPost {
  kind: string;
  data: PostData;
}
