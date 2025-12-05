export interface Review {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
  };
  rating: number;
  comment: string;
  date: string;
}

export interface CommentData {
  rating: number;
  comment: string;
}
