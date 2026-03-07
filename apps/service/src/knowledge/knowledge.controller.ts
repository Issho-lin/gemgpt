import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
import { CreateGeneralKnowledgeDto, GetUploadPresignedDto, CreateDocumentDto } from './dto/knowledge.dto';

type AuthRequest = ExpressRequest & {
  user: {
    id: string;
    username: string;
    role: string;
  };
};

@UseGuards(AuthGuard('jwt'))
@Controller('knowledge-bases')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) { }

  @Post()
  create(
    @Request() req: AuthRequest,
    @Body() createDto: Prisma.KnowledgeBaseCreateWithoutUserInput,
  ) {
    return this.knowledgeService.create(req.user.id, createDto);
  }

  @Post('general')
  createGeneral(@Request() req: AuthRequest, @Body() body: CreateGeneralKnowledgeDto) {
    return this.knowledgeService.createGeneral(req.user.id, body);
  }

  @Post(':id/upload/presigned')
  getUploadPresigned(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: GetUploadPresignedDto,
  ) {
    const filename = body?.filename?.trim();
    if (!filename) {
      throw new BadRequestException('filename is required');
    }

    return this.knowledgeService.getUploadPresigned(
      req.user.id,
      id,
      filename,
      body?.contentType,
    );
  }

  @Post(':id/documents')
  createDocument(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: CreateDocumentDto,
  ) {
    const filename = body?.filename?.trim();
    const fileType = body?.fileType?.trim();
    const objectKey = body?.objectKey?.trim();

    if (!filename) {
      throw new BadRequestException('filename is required');
    }
    if (!fileType) {
      throw new BadRequestException('fileType is required');
    }
    if (!objectKey) {
      throw new BadRequestException('objectKey is required');
    }

    return this.knowledgeService.createDocument(req.user.id, id, {
      filename,
      fileType,
      objectKey,
    });
  }

  @Get()
  findAll(@Request() req: AuthRequest) {
    return this.knowledgeService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.knowledgeService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() updateDto: Prisma.KnowledgeBaseUpdateWithoutUserInput,
  ) {
    return this.knowledgeService.update(req.user.id, id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.knowledgeService.remove(req.user.id, id);
  }
}
