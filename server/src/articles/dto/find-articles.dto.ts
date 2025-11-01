import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FindArticlesDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  postId?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  published?: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  me?: boolean;
}
