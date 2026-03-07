import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { StorageService } from './storage.service';

type CreateGeneralKnowledgeInput = {
  name: string;
  intro?: string;
  avatar?: string;
  vectorModel?: string;
  agentModel?: string;
  vlmModel?: string;
};

type CreateDocumentInput = {
  filename: string;
  fileType: string;
  objectKey: string;
};

@Injectable()
export class KnowledgeService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async create(
    userId: string,
    data: Prisma.KnowledgeBaseCreateWithoutUserInput,
  ) {
    return this.prisma.knowledgeBase.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async createGeneral(userId: string, data: CreateGeneralKnowledgeInput) {
    const name = data.name?.trim();

    if (!name) {
      throw new BadRequestException('Knowledge base name is required');
    }

    return this.prisma.knowledgeBase.create({
      data: {
        userId,
        name,
        description: data.intro?.trim() || null,
        type: 'general',
        config: {
          avatar: data.avatar,
          vectorModel: data.vectorModel,
          agentModel: data.agentModel,
          vlmModel: data.vlmModel,
        },
      },
    });
  }

  async getUploadPresigned(
    userId: string,
    id: string,
    filename: string,
    contentType?: string,
  ) {
    const objectName = filename?.trim();
    if (!objectName) {
      throw new BadRequestException('filename is required');
    }

    await this.findOne(userId, id);

    return this.storageService.getPresignedUploadUrl({
      userId,
      knowledgeBaseId: id,
      filename: objectName,
      contentType,
    });
  }

  async createDocument(userId: string, knowledgeBaseId: string, data: CreateDocumentInput) {
    await this.findOne(userId, knowledgeBaseId);

    const id = randomUUID();

    await this.prisma.$executeRaw`
      INSERT INTO "documents" ("id", "knowledgeBaseId", "filename", "fileType", "objectKey", "status", "createdAt")
      VALUES (${id}, ${knowledgeBaseId}, ${data.filename}, ${data.fileType}, ${data.objectKey}, 'pending', NOW())
    `;

    return this.prisma.document.findUnique({
      where: { id },
    });
  }

  async findAll(userId: string) {
    return this.prisma.knowledgeBase.findMany({
      where: { userId },
      include: {
        _count: {
          select: { documents: true },
        },
      },
    });
  }

  async findOne(userId: string, id: string) {
    const kb = await this.prisma.knowledgeBase.findFirst({
      where: { id, userId },
      include: {
        documents: true,
      },
    });
    if (!kb) {
      throw new NotFoundException(`Knowledge Base with ID ${id} not found`);
    }
    return kb;
  }

  async update(
    userId: string,
    id: string,
    data: Prisma.KnowledgeBaseUpdateWithoutUserInput,
  ) {
    await this.findOne(userId, id);
    return this.prisma.knowledgeBase.update({
      where: { id },
      data,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.knowledgeBase.delete({
      where: { id },
    });
  }
}
