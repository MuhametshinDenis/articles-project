import { Article } from 'generated/prisma';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';

export interface ArticleRepository {
  create(data: CreateArticleDto): Promise<Article>;

  findById(id: number): Promise<Article | null>;

  findAll(): Promise<Article[]>;

  update(id: number, data: UpdateArticleDto): Promise<Article>;

  delete(articleId: number): Promise<void>;

  runInTransaction<T>(
    callback: (repo: ArticleRepository) => Promise<T>,
  ): Promise<T>;
}

export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY');
