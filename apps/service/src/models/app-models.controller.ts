import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AppModelsService } from './app-models.service';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';

@Controller('core/ai/model')
export class AppModelsController {
  constructor(private readonly appModelsService: AppModelsService) {}

  @Get('list')
  findAll() {
    return this.appModelsService.findAll();
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  create(@Body() data: Prisma.AppModelCreateInput) {
    return this.appModelsService.create(data);
  }
}
