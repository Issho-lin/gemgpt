import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';

type CreateGeneralKnowledgeBody = {
  name: string;
  intro?: string;
  avatar?: string;
  vectorModel?: string;
  agentModel?: string;
  vlmModel?: string;
};

@UseGuards(AuthGuard('jwt'))
@Controller('knowledge-bases')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post()
  create(@Request() req, @Body() createDto: Prisma.KnowledgeBaseCreateWithoutUserInput) {
    return this.knowledgeService.create(req.user.id, createDto);
  }

  @Post('general')
  createGeneral(@Request() req, @Body() body: CreateGeneralKnowledgeBody) {
    return this.knowledgeService.createGeneral(req.user.id, body);
  }

  @Get()
  findAll(@Request() req) {
    return this.knowledgeService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.knowledgeService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: Prisma.KnowledgeBaseUpdateWithoutUserInput
  ) {
    return this.knowledgeService.update(req.user.id, id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.knowledgeService.remove(req.user.id, id);
  }
}
