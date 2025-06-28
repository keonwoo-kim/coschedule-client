export interface Comment {
  id: number;
  itemId: number;
  userName: string;
  content: string;
  createdUtc: string;
  updatedUtc: string;
}

export interface RatingFormProps {
  itemId: number;
}

export interface CommentFormProps {
  itemId: number;
  onReload: () => void;
}

export interface CommentListProps {
  comments: Comment[];
  onReload: () => void;
}

export interface ItemDetailModuleProps {
  itemId: number;
}
