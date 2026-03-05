import { Controller, Get, Post, Body, UseGuards, Delete, Query, Patch, ParseIntPipe } from '@nestjs/common';
import { AppModelsService } from './app-models.service';
import { AiproxyService } from '../aiproxy/aiproxy.service';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';

@Controller('core/ai/model')
export class AppModelsController {
  constructor(
    private readonly appModelsService: AppModelsService,
    private readonly aiproxyService: AiproxyService,
  ) { }

  @Get('list')
  findAll() {
    return this.appModelsService.findAll();
  }

  @Get('providers')
  getProviders() {
    return this.appModelsService.getProviders();
  }

  @Get('aiproxyMap')
  getAiproxyIdMap() {
    return this.appModelsService.getAiproxyIdMap();
  }

  /**
   * Test a specific model through a specific channel.
   * GET /core/ai/model/test?model=xxx&channelId=yyy
   */
  @Get('test')
  @UseGuards(AuthGuard('jwt'))
  testModel(
    @Query('model') model: string,
    @Query('channelId', ParseIntPipe) channelId: number,
  ) {
    return this.aiproxyService.testModel(channelId, model);
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  create(@Body() data: Prisma.AppModelCreateInput) {
    return this.appModelsService.create(data);
  }

  @Delete('delete')
  @UseGuards(AuthGuard('jwt'))
  remove(@Query('id') id: string) {
    return this.appModelsService.remove(id);
  }

  @Patch('toggle')
  @UseGuards(AuthGuard('jwt'))
  toggleActive(@Body() data: { model: string, isActive: boolean }) {
    return this.appModelsService.toggleActive(data.model, data.isActive);
  }
}

