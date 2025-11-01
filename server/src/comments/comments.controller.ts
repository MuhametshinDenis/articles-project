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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserDetails } from '../auth/decorator/user-details.decorator';
import * as userDetailsTypes from '../auth/types/user-details.types';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';

@UseGuards(AuthGuard)
@Controller('/api/v1/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  public async create(
    @Body() createCommentDto: CreateCommentDto,
    @UserDetails() userDetails: userDetailsTypes.UserDetailsTypes,
  ) {
    return this.commentsService.create(createCommentDto, userDetails);
  }

  @Get('/:id')
  public async findAllInArticle(@Param('id') articleId: number) {
    return this.commentsService.findAllInArticle(articleId);
  }

  @Patch('/:articleId/:commentId')
  public async update(
    @Param('articleId') articleId: number,
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @UserDetails() userDetails: userDetailsTypes.UserDetailsTypes,
  ) {
    return this.commentsService.update(
      articleId,
      commentId,
      updateCommentDto,
      userDetails,
    );
  }

  @Delete('/:articleId/:commentId')
  public async delete(
    @Param('articleId') articleId: number,
    @Param('commentId') commentId: number,
    @UserDetails() userDetails: userDetailsTypes.UserDetailsTypes,
  ) {
    return this.commentsService.delete(articleId, commentId, userDetails);
  }
}
