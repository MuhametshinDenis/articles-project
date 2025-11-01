import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserDetailsTypes } from '../auth/types/user-details.types';
import { CommentResponseDto } from './dto/comment-response.dto';
import { UsersService } from '../users/users.service';
import { ArticlesService } from '../articles/articles.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly articleService: ArticlesService,
  ) {}

  /**
   * Creates a new comment for a given article and associates it with a user.
   *
   * @param {CreateCommentDto} createCommentDto - Data transfer object containing article ID and comment content.
   * @param {UserDetailsTypes} userDetails - Object containing details of the user making the request.
   * @return {Promise<CommentResponseDto>} Returns a promise that resolves to the created comment response object, including the comment details and user information.
   * @throws {NotFoundException} Throws if the user or article does not exist.
   */
  public async create(
    createCommentDto: CreateCommentDto,
    userDetails: UserDetailsTypes,
  ): Promise<CommentResponseDto> {
    const user = await this.usersService.findById(userDetails.id);

    if (!user) {
      throw new NotFoundException(`User with id ${userDetails.id} not founded`);
    }

    const articleExists = await this.articleService.existsById(
      createCommentDto.articleId,
    );

    if (!articleExists) {
      throw new NotFoundException(
        `Article with id ${createCommentDto.articleId} not founded`,
      );
    }

    const comment = await this.prisma.comment.create({
      data: {
        userId: user.id,
        articleId: createCommentDto.articleId,
        content: createCommentDto.content,
      },
    });

    return {
      id: comment.id,
      articleId: comment.articleId,
      content: comment.content,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  /**
   * Retrieves all comments associated with a specific article.
   *
   * @param {number} articleId - The ID of the article for which comments are to be retrieved.
   * @return {Promise<CommentResponseDto[]>} A promise that resolves to an array of comment objects with associated user information.
   */
  public async findAllInArticle(
    articleId: number,
  ): Promise<CommentResponseDto[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        articleId,
      },
      select: {
        id: true,
        articleId: true,
        content: true,
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return comments.map(({ User, ...data }) => {
      return {
        ...data,
        user: User,
      };
    });
  }

  /**
   * Updates a comment associated with a specific article and user.
   *
   * @param {number} articleId - The ID of the article containing the comment.
   * @param {number} commentId - The ID of the comment to be updated.
   * @param {UpdateCommentDto} updateCommentDto - The data transfer object containing the updated content of the comment.
   * @param {UserDetailsTypes} userDetails - An object containing details about the current user.
   * @return {Promise<CommentResponseDto>} A promise that resolves to the updated comment details including the user who created it.
   * @throws {NotFoundException} Throws an error if the user is not found.
   * @throws {NotFoundException} Throws an error if the comment or associated article is not found.
   * @throws {NotFoundException} Throws an error if the user is not authorized to update the comment.
   */
  public async update(
    articleId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    userDetails: UserDetailsTypes,
  ): Promise<CommentResponseDto> {
    const user = await this.usersService.findById(userDetails.id);

    if (!user) {
      throw new NotFoundException(`User with id ${userDetails.id} not founded`);
    }

    const commentExists = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
        articleId,
      },
    });

    if (!commentExists) {
      throw new NotFoundException(
        `Comment with ID: ${commentId} or articleId: ${articleId} not founded`,
      );
    }

    const isAuthor = commentExists.userId === user.id;

    if (!isAuthor) {
      throw new NotFoundException(`You are not allowed to update this comment`);
    }

    const { User, ...data } = await this.prisma.comment.update({
      where: {
        id: commentExists.id,
      },
      data: {
        content: updateCommentDto.content,
      },
      select: {
        id: true,
        articleId: true,
        content: true,
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      ...data,
      user: User,
    };
  }

  //TODO: Remove code duplication, move it to a private method
  public async delete(
    articleId: number,
    commentId: number,
    userDetails: UserDetailsTypes,
  ): Promise<ApiResponseDto<string>> {
    const user = await this.usersService.findById(userDetails.id);

    if (!user) {
      throw new NotFoundException(`User with id ${userDetails.id} not founded`);
    }

    const commentExists = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
        articleId,
      },
    });

    if (!commentExists) {
      throw new NotFoundException(
        `Comment with ID: ${commentId} or articleId: ${articleId} not founded`,
      );
    }

    const isAuthor = commentExists.userId === user.id;

    if (!isAuthor) {
      throw new NotFoundException(`You are not allowed to update this comment`);
    }

    await this.prisma.comment.delete({
      where: {
        id: commentExists.id,
      },
    });

    return {
      message: 'Successful deletion of comment',
    };
  }
}
