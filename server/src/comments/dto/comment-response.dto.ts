export class CommentResponseDto {
  id: number;
  articleId: number;
  content: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
}
