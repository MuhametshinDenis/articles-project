import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtManagerService } from '../jwt-manager/jwt-manager.service';
import { UsersService } from '../users/users.service';
import { UserDetailsTypes } from '../auth/types/user-details.types';
import { FindArticlesDto } from './dto/find-articles.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtManagerService: JwtManagerService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Creates a new article and associates it with the user.
   *
   * @param {CreateArticleDto} createArticleDto - DTO containing data for creating the article, including title, content, and published status.
   * @param {UserDetailsTypes} userDetails - Details of the user creating the article.
   * @return {Promise<ArticleResponseDto | null>} A promise that resolves with the created article's response DTO or null if no article is found.
   * @throws {NotFoundException} If the user with the specified ID is not found.
   */
  //TODO: refactor the returns so it shouldn't return null
  public async create(
    createArticleDto: CreateArticleDto,
    userDetails: UserDetailsTypes,
  ): Promise<ArticleResponseDto | null> {
    const user = await this.usersService.findById(userDetails.id);

    if (!user) {
      throw new NotFoundException(`User with id ${userDetails.id} not founded`);
    }

    return this.prisma.$transaction(async (tx) => {
      const article = await tx.article.create({
        data: {
          title: createArticleDto.title,
          content: createArticleDto.content,
          published: createArticleDto.published,
        },
      });

      await tx.usersOnArticles.create({
        data: {
          userId: user.id,
          articleId: article.id,
        },
      });

      return tx.article.findUnique({
        where: { id: article.id },
        select: {
          id: true,
          title: true,
          content: true,
          published: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  }

  /**
   * Finds articles based on the provided filters and user details.
   * Applies filters such as post ID, publication status, user association, title, and content.
   *
   * @param {FindArticlesDto} filters - The filters to be applied for searching articles. This may include post ID, publication status, associated user ID, title, and content.
   * @param {UserDetailsTypes} userDetails - The details of the user making the request. Used to determine if the user's articles should be fetched when the `me` filter is set.
   * @return {Promise<ArticleResponseDto[]>} Returns a promise that resolves to an array of articles that match the specified criteria.
   * @throws {NotFoundException} Throws an exception if the user specified in `userDetails` is not found and the `me` filter is applied.
   */
  // TODO: replace search by title and content on fullTextSearchPostgres https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting##sort-by-relevance-postgresql-and-mysql
  public async findByFilters(
    filters: FindArticlesDto,
    userDetails: UserDetailsTypes,
  ): Promise<ArticleResponseDto[]> {
    let userIdFilter: number | undefined = filters.userId;

    if (filters.me) {
      const user = await this.usersService.findById(userDetails.id);

      if (!user) {
        throw new NotFoundException(`User with id ${userDetails.id} not found`);
      }

      userIdFilter = user.id;
    }

    return this.prisma.article.findMany({
      where: {
        id: filters.postId,
        published: filters.published,
        users: userIdFilter
          ? {
              some: {
                userId: userIdFilter,
              },
            }
          : undefined,
        title: filters.title
          ? {
              contains: filters.title,
              mode: 'insensitive',
            }
          : undefined,
        content: filters.content
          ? {
              contains: filters.content,
              mode: 'insensitive',
            }
          : undefined,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Deletes an article specified by its ID, ensuring the user requesting the deletion is the author of the article.
   *
   * @param {number} postId - The ID of the article to be deleted.
   * @param {UserDetailsTypes} userDetails - The details of the user requesting the deletion.
   * @return {Promise<void>} A promise that resolves when the article is successfully deleted.
   * @throws {NotFoundException} If the user or article does not exist.
   * @throws {ForbiddenException} If the user is not the author of the article.
   */
  public async delete(
    postId: number,
    userDetails: UserDetailsTypes,
  ): Promise<void> {
    const user = await this.usersService.findById(userDetails.id);

    if (!user) {
      throw new NotFoundException(`User with id ${userDetails.id} not found`);
    }

    const article = await this.prisma.article.findUnique({
      where: { id: postId },
      include: { users: true },
    });

    if (!article) {
      throw new NotFoundException(`Article with id ${postId} not found`);
    }

    const isAuthor = article.users.some((u) => u.userId === user.id);

    if (!isAuthor) {
      throw new ForbiddenException(
        `You are not allowed to delete this article`,
      );
    }

    await this.prisma.article.delete({
      where: { id: postId },
    });
  }

  /**
   * Updates an article based on the provided data, post ID, and user details.
   * Checks if the user exists, verifies authorship of the article, and updates the article if all checks pass.
   * Throws an error if the user or article is not found or if the user is not the author of the article.
   *
   * @param {UpdateArticleDto} updateArticleDto - The data to update the article with, including new title, content, and published status.
   * @param {number} postId - The ID of the article to be updated.
   * @param {UserDetailsTypes} userDetails - The details of the user performing the update, including user ID.
   * @return {Promise<ArticleResponseDto>} The updated article object.
   * @throws {NotFoundException} If the user or the article is not found.
   * @throws {ForbiddenException} If the user is not allowed to update the article.
   */
  public async update(
    updateArticleDto: UpdateArticleDto,
    postId: number,
    userDetails: UserDetailsTypes,
  ): Promise<ArticleResponseDto> {
    const user = await this.usersService.findById(userDetails.id);

    if (!user) {
      throw new NotFoundException(`User with id ${userDetails.id} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      const article = await tx.article.findUnique({
        where: { id: postId },
        include: { users: true },
      });

      if (!article) {
        throw new NotFoundException(`Article with id ${postId} not found`);
      }

      const isAuthor = article.users.some((u) => u.userId === user.id);

      if (!isAuthor) {
        throw new ForbiddenException(
          `You are not allowed to update this article`,
        );
      }

      return tx.article.update({
        where: { id: postId },
        data: {
          title: updateArticleDto.title,
          content: updateArticleDto.content,
          published: updateArticleDto.published,
        },
      });
    });
  }

  /**
   * Checks if an article exists by the given ID.
   *
   * @param {number} id - The identifier of the article to check for existence.
   * @return {Promise<boolean>} A promise that resolves to true if the article exists, otherwise false.
   */
  public async existsById(id: number): Promise<boolean> {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    return !!article;
  }
}
