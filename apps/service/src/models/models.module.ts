import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { AppModelsService } from './app-models.service';
import { AppModelsController } from './app-models.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ModelsController, AppModelsController],
  providers: [ModelsService, AppModelsService],
  exports: [ModelsService, AppModelsService],
})
export class ModelsModule {}
