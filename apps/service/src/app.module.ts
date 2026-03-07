import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ModelsModule } from './models/models.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { AiproxyModule } from './aiproxy/aiproxy.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ModelsModule,
    KnowledgeModule,
    AiproxyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
