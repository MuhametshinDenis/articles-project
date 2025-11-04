import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UpdateArticleDto } from './dto/update-article.dto';

@UseGuards(AuthGuard)
@Controller('/api/v1/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  public async create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  public async findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  public async findById(@Param('id') articleId: number) {
    return this.articlesService.findById(articleId);
  }

  @Patch(':id')
  public async update(
    @Param('id') articleId: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(articleId, updateArticleDto);
  }

  @Delete(':id')
  public async delete(@Param('id') articleId: number) {
    return this.articlesService.delete(articleId);
  }
}
