import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ArticleRepository } from './article.repository';
import { Article } from 'generated/prisma';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';

@Injectable()
export class ArticleRepositoryImpl implements ArticleRepository {
  constructor(private prisma: PrismaService) {}

  public async create(data: CreateArticleDto): Promise<Article> {
    return this.prisma.article.create({ data });
  }

  public async findById(id: number): Promise<Article | null> {
    const article = await this.prisma.article.findUnique({
      where: {
        id,
      },
    });

    return article ? article : null;
  }

  public async findAll(): Promise<Article[]> {
    return this.prisma.article.findMany();
  }

  public async update(id: number, data: UpdateArticleDto): Promise<Article> {
    return this.prisma.article.update({
      where: {
        id,
      },
      data,
    });
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.article.delete({
      where: {
        id,
      },
    });
  }

  public async runInTransaction<T>(
    callback: (repo: ArticleRepository) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      const transactionalRepo = new ArticleRepositoryImpl(tx as PrismaService);
      return callback(transactionalRepo);
    });
  }
}
