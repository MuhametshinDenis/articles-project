import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UsersService } from '../users/users.service';
import { ArticleResponseDto } from './dto/article-response.dto';
import {
  ARTICLE_REPOSITORY,
  type ArticleRepository,
} from './repository/article.repository';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) {}

  public async create(
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseDto> {
    return this.articleRepository.runInTransaction(async (repo) => {
      return await repo.create({
        title: createArticleDto.title,
        content: createArticleDto.content,
        published: createArticleDto.published,
      });
    });
  }

  findAll() {
    return this.articleRepository.findAll();
  }

  public async findById(articleId: number) {
    const article = await this.articleRepository.findById(articleId);

    if (!article) {
      throw new NotFoundException(`Article with ID: ${articleId} not found`);
    }

    return article;
  }

  public async update(articleId: number, updateArticleDto: UpdateArticleDto) {
    const articleExists = await this.findById(articleId);
    return this.articleRepository.update(articleExists.id, updateArticleDto);
  }

  public async delete(articleId: number) {
    const articleExists = await this.findById(articleId);
    return this.articleRepository.delete(articleExists.id);
  }
}
