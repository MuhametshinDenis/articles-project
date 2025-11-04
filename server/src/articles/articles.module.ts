import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { ARTICLE_REPOSITORY } from './repository/article.repository';
import { ArticleRepositoryImpl } from './repository/article.repository.impl';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule],
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    {
      provide: ARTICLE_REPOSITORY,
      useClass: ArticleRepositoryImpl,
    },
  ],
})
export class ArticlesModule {}
