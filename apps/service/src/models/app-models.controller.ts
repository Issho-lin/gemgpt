import { Controller, Get, Post, Body, UseGuards, Delete, Query, Patch } from '@nestjs/common';
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
  async testModel(
    @Query('model') model: string,
    @Query('channelId') channelIdStr?: string,
    @Query('modelType') modelType?: string,
  ) {
    const channelId = channelIdStr ? parseInt(channelIdStr, 10) : undefined;
    // 若前端未传 modelType，则从模型列表自动推断
    let resolvedType = modelType;
    if (!resolvedType) {
      try {
        const allModels = await this.appModelsService.findAll();
        const found = allModels.find((m: any) => m.model === model);
        resolvedType = found?.type;
      } catch {
        // 推断失败则按默认 llm 处理
      }
    }
    return this.aiproxyService.testModel(channelId, model, resolvedType);
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

  @Patch('default')
  @UseGuards(AuthGuard('jwt'))
  updateDefault(@Body() data: any) {
    return this.appModelsService.updateDefaultModels(data);
  }

  @Patch('toggle')
  @UseGuards(AuthGuard('jwt'))
  toggleActive(@Body() data: { model: string, isActive: boolean }) {
    return this.appModelsService.toggleActive(data.model, data.isActive);
  }
}

