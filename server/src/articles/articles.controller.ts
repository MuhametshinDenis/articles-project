import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UserDetails } from 'src/auth/decorator/user-details.decorator';
import * as userDetailsTypes from '../auth/types/user-details.types';
import { FindArticlesDto } from './dto/find-articles.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@UseGuards(AuthGuard)
@Controller('/api/v1/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  public create(
    @Body() createArticleDto: CreateArticleDto,
    @UserDetails() userDetails: userDetailsTypes.UserDetailsTypes,
  ) {
    return this.articlesService.create(createArticleDto, userDetails);
  }

  @Get()
  public async findAll(
    @Query(new ValidationPipe({ transform: true }))
    filters: FindArticlesDto,
    @UserDetails() userDetails: userDetailsTypes.UserDetailsTypes,
  ) {
    return this.articlesService.findByFilters(filters, userDetails);
  }

  @Delete('/:id')
  public async delete(
    @Param('id') postId: number,
    @UserDetails() userDetails: userDetailsTypes.UserDetailsTypes,
  ) {
    return this.articlesService.delete(postId, userDetails);
  }

  @Patch('/:id')
  public async update(
    @Param('id') postId: number,
    @UserDetails() userDetails: userDetailsTypes.UserDetailsTypes,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(updateArticleDto, postId, userDetails);
  }
}
