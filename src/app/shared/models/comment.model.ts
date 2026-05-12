export interface Comment {
  id: number;
  text: string;
  rating: number;
  userName: string;
  userId: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}
