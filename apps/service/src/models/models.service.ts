import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ModelsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: Prisma.ModelConfigCreateWithoutUserInput) {
    return this.prisma.modelConfig.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.modelConfig.findMany({
      where: { userId },
    });
  }

  async findOne(userId: string, id: string) {
    const model = await this.prisma.modelConfig.findFirst({
      where: { id, userId },
    });
    if (!model) {
      throw new NotFoundException(`Model config with ID ${id} not found`);
    }
    return model;
  }

  async update(userId: string, id: string, data: Prisma.ModelConfigUpdateWithoutUserInput) {
    await this.findOne(userId, id); // Ensure existence
    return this.prisma.modelConfig.update({
      where: { id },
      data,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id); // Ensure existence
    return this.prisma.modelConfig.delete({
      where: { id },
    });
  }
}
