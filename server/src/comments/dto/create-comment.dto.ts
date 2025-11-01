import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsNumber()
  articleId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
