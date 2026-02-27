import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class AppModelsService {
  private readonly logger = new Logger(AppModelsService.name);

  // Plugin 服务地址（与 FastGPT 共享）
  private readonly pluginBaseUrl = process.env.PLUGIN_BASE_URL || '';
  private readonly pluginToken = process.env.PLUGIN_TOKEN || '';

  constructor(private prisma: PrismaService) { }

  /** 公共请求头 */
  private get pluginHeaders() {
    return this.pluginToken ? { authtoken: this.pluginToken } : {};
  }

  /**
   * 从 Plugin 获取 provider → avatar 映射表。
   * 结构: { "OpenAI": "https://...openai.png", "Anthropic": "...", ... }
   */
  private async fetchProviderAvatarMap(): Promise<Record<string, string>> {
    if (!this.pluginBaseUrl) return {};
    try {
      const url = `${this.pluginBaseUrl.replace(/\/$/, '')}/model/getProviders`;
      const res = await axios.get(url, {
        headers: this.pluginHeaders,
        timeout: 5000,
      });
      if (res.status === 200 && Array.isArray(res.data?.modelProviders)) {
        return res.data.modelProviders.reduce(
          (acc: Record<string, string>, p: { provider: string; avatar: string }) => {
            if (p.provider && p.avatar) acc[p.provider] = p.avatar;
            return acc;
          },
          {}
        );
      }
    } catch (error: any) {
      this.logger.warn(`获取 Provider 头像失败: ${error.message}`);
    }
    return {};
  }

  /**
   * 从 FastGPT Plugin 服务拉取模型列表。
   * 如果 Plugin 不可用，返回 null（由调用方决定降级策略）。
   */
  private async fetchFromPlugin(): Promise<any[] | null> {
    if (!this.pluginBaseUrl) return null;

    try {
      const url = `${this.pluginBaseUrl.replace(/\/$/, '')}/model/list`;
      const response = await axios.get(url, {
        headers: this.pluginHeaders,
        timeout: 5000,
      });
      if (response.status === 200 && Array.isArray(response.data)) {
        return response.data;
      }
    } catch (error: any) {
      this.logger.warn(`Plugin 服务不可用，降级到数据库缓存: ${error.message}`);
    }
    return null;
  }

  /**
   * 获取全量模型列表，并注入 avatar / contextToken / vision / toolChoice：
   *   1. 优先从 FastGPT Plugin 服务实时拉取（与 FastGPT 同源）
   *   2. Plugin 不可用时，降级到本地 DB 缓存（app_models 表）
   */
  async findAll() {
    // 并行拉取：模型列表 + Provider 头像映射
    const [pluginModels, providerAvatarMap] = await Promise.all([
      this.fetchFromPlugin(),
      this.fetchProviderAvatarMap(),
    ]);

    if (pluginModels) {
      return pluginModels.map((model: any) => ({
        ...model,
        avatar: providerAvatarMap[model.provider] ?? null,
        contextToken: model.contextToken ?? model.maxContext ?? model.maxToken,
        vision: model.vision,
        toolChoice: model.toolChoice,
      }));
    }

    // 降级：使用数据库缓存
    this.logger.log('使用数据库缓存的模型列表');
    const models = await this.prisma.appModel.findMany();

    return models.map((model) => {
      const config = (model.config as any) || {};
      return {
        ...model,
        avatar: providerAvatarMap[model.provider] ?? null,
        contextToken: config.maxContext ?? config.maxToken,
        vision: config.vision,
        toolChoice: config.toolChoice,
      };
    });
  }

  /**
   * 同步模型到本地 DB（用于 seed-models 脚本）。
   * Upsert by model 字段，避免重复。
   */
  async create(data: Prisma.AppModelCreateInput) {
    return this.prisma.appModel.upsert({
      where: { model: data.model },
      update: data,
      create: data,
    });
  }
}
