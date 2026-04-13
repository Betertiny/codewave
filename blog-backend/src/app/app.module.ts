import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { PostsModule } from '../modules/posts/posts.module';
import { TagsModule } from '../modules/tags/tags.module';
import { CategoriesModule } from '../modules/categories/categories.module';
import { AboutModule } from '../modules/about/about.module';
import { UploadModule } from '../modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    PostsModule,
    TagsModule,
    CategoriesModule,
    AboutModule,
    UploadModule,
  ],
})
export class AppModule {}
