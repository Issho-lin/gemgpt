import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ModelsService } from './models.service';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';

@UseGuards(AuthGuard('jwt'))
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Post('test')
  testConnection(@Body() config: any) {
    return this.modelsService.testConnection(config);
  }

  @Post()
  create(@Request() req, @Body() createModelDto: Prisma.ModelConfigCreateWithoutUserInput) {
    return this.modelsService.create(req.user.id, createModelDto);
  }

  @Get('logs')
  getLogs(@Request() req, @Query('page') page: string, @Query('limit') limit: string) {
    return this.modelsService.getLogs(req.user.id, Number(page) || 1, Number(limit) || 20);
  }

  @Get('monitor')
  getMonitorStats(@Request() req) {
    return this.modelsService.getMonitorStats(req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.modelsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.modelsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateModelDto: Prisma.ModelConfigUpdateWithoutUserInput) {
    return this.modelsService.update(req.user.id, id, updateModelDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.modelsService.remove(req.user.id, id);
  }
}
