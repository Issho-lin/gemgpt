import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import axios from 'axios';

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

  async testConnection(config: any) {
    const aiproxyUrl = process.env.AIPROXY_API_ENDPOINT;
    const aiproxyToken = process.env.AIPROXY_API_TOKEN;

    if (!aiproxyUrl || !aiproxyToken) {
        throw new BadRequestException('AIPROXY_API_ENDPOINT or AIPROXY_API_TOKEN not configured in server environment');
    }

    // Default to system config if not provided in user config
    const apiKey = config.apiKey || aiproxyToken;
    let baseURL = config.baseURL || aiproxyUrl;

    // Remove trailing slash if present
    if (baseURL.endsWith('/')) {
        baseURL = baseURL.slice(0, -1);
    }

    try {
        console.log(`Testing connection to ${baseURL} with key ending in ...${apiKey.slice(-4)}`);
        
        // Use /v1/models to test connectivity
        const response = await axios.get(`${baseURL}/v1/models`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            timeout: 5000 // 5s timeout
        });

        if (response.status === 200) {
             return { success: true, message: 'Connection successful', models: response.data.data?.length };
        } else {
             return { success: false, message: `Connection failed with status: ${response.status}` };
        }

    } catch (error) {
        console.error('Model connection test failed:', error.message);
        // If /v1/models fails (some proxies might not support it), try a simple chat completion
        try {
            console.log('Fallback: Testing chat completion...');
            const chatResponse = await axios.post(`${baseURL}/v1/chat/completions`, {
                model: config.modelName || 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: 'Hi' }],
                max_tokens: 1
            }, {
                headers: { 'Authorization': `Bearer ${apiKey}` },
                timeout: 5000
            });
            if (chatResponse.status === 200) {
                 return { success: true, message: 'Connection successful (via chat)' };
            }
        } catch (chatError) {
             console.error('Fallback chat test failed:', chatError.message);
        }

        return { 
            success: false, 
            message: error.response?.data?.error?.message || error.message || 'Connection failed' 
        };
    }
  }

  async getLogs(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, logs] = await Promise.all([
      this.prisma.modelLog.count({ where: { userId } }),
      this.prisma.modelLog.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { modelConfig: { select: { name: true } } }
      })
    ]);
    return { total, page, limit, logs };
  }

  async getMonitorStats(userId: string) {
    // Simple aggregation: total tokens, request count, success rate
    const totalRequests = await this.prisma.modelLog.count({ where: { userId } });
    const totalTokens = await this.prisma.modelLog.aggregate({
      where: { userId },
      _sum: { totalTokens: true }
    });
    
    // Group by status
    const statusGroups = await this.prisma.modelLog.groupBy({
        by: ['status'],
        where: { userId },
        _count: { status: true }
    });

    // Recent logs (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = await this.prisma.modelLog.groupBy({
        by: ['createdAt'], // Prisma doesn't support grouping by date part easily without raw query, will use raw query for time series if needed. 
        // For simplicity now, just returning summary.
        where: { userId, createdAt: { gte: sevenDaysAgo } },
        _count: { id: true },
        _sum: { totalTokens: true }
    });

    return {
        totalRequests,
        totalTokens: totalTokens._sum.totalTokens || 0,
        statusDistribution: statusGroups,
    };
  }
}
