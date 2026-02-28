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
   * 从 Plugin 获取 provider 详细信息映射表 (包含 avatar 和 order)。
   */
  private async fetchProviderMap(): Promise<Record<string, { avatar: string, order: number, name?: string }>> {
    if (!this.pluginBaseUrl) return {};
    try {
      const url = `${this.pluginBaseUrl.replace(/\/$/, '')}/model/getProviders`;
      const res = await axios.get(url, {
        headers: this.pluginHeaders,
        timeout: 5000,
      });
      if (res.status === 200 && Array.isArray(res.data?.modelProviders)) {
        return res.data.modelProviders.reduce(
          (acc: Record<string, { avatar: string, order: number, name?: string }>, p: { provider: string; avatar: string; value?: any }, index: number) => {
            if (p.provider) {
              acc[p.provider] = {
                avatar: p.avatar || '',
                order: index,
                name: p.value?.['zh-CN'] || p.value?.en || p.provider,
              };
            }
            return acc;
          },
          {}
        );
      }
    } catch (error: any) {
      this.logger.warn(`获取 Provider 信息失败: ${error.message}`);
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
    // 并行拉取：模型列表 + Provider 信息映射
    const [pluginModels, providerMap] = await Promise.all([
      this.fetchFromPlugin(),
      this.fetchProviderMap(),
    ]);

    // 辅助匹配函数解决 FastGPT 插件中 provider 不一致问题 (比如 Intern vs InternLM)
    const getProviderConfig = (providerName: string) => {
      if (!providerName) return null;
      if (providerMap[providerName]) return { id: providerName, ...providerMap[providerName] };

      const lowerReq = providerName.toLowerCase();
      // 寻找子串匹配
      const match = Object.entries(providerMap).find(([key]) => {
        const lowerKey = key.toLowerCase();
        return lowerKey.includes(lowerReq) || lowerReq.includes(lowerKey);
      });
      return match ? { id: match[0], ...match[1] } : null;
    };

    if (pluginModels) {
      // 查询本地缓存作为覆盖（由于是 Plugin 数据，状态信息需覆盖至本地处理）
      const localModels = await this.prisma.appModel.findMany();
      const localMap = new Map<string, any>();
      localModels.forEach(m => localMap.set(m.model, m.config));

      return pluginModels.map((model: any) => {
        const config = getProviderConfig(model.provider);
        const localConfigInfo = localMap.get(model.model) || {};
        return {
          ...model,
          provider: config?.id || model.provider, // 统一提供商标识
          avatar: config?.avatar ?? null,
          order: config?.order ?? 999,
          contextToken: model.contextToken ?? model.maxContext ?? model.maxToken,
          vision: model.vision,
          toolChoice: model.toolChoice,
          isActive: localConfigInfo.isActive ?? model.isActive ?? false,
          isCustom: localConfigInfo.isCustom ?? model.isCustom ?? false,
        };
      });
    }

    // 降级：使用数据库缓存
    this.logger.log('使用数据库缓存的模型列表');
    const models = await this.prisma.appModel.findMany();

    return models.map((model) => {
      const configInfo = (model.config as any) || {};
      const config = getProviderConfig(model.provider);
      return {
        ...model,
        provider: config?.id || model.provider, // 统一提供商标识
        avatar: config?.avatar ?? null,
        order: config?.order ?? 999,
        contextToken: configInfo.maxContext ?? configInfo.maxToken,
        vision: configInfo.vision,
        toolChoice: configInfo.toolChoice,
        isActive: configInfo.isActive ?? false,
        isCustom: configInfo.isCustom ?? false,
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

  /**
   * 删除本地自定义模型
   */
  async remove(id: string) {
    if (!this.pluginBaseUrl) {
      return this.prisma.appModel.delete({
        where: { id },
      });
    }
    try {
      const url = `${this.pluginBaseUrl.replace(/\/$/, '')}/model/delete`;
      await axios.post(url, { id }, {
        headers: this.pluginHeaders,
        timeout: 5000,
      });
      return { success: true };
    } catch (error: any) {
      this.logger.warn(`Plugin 删除模型失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 切换模型的启用状态（独立在本地进行管理，不影响外部）
   */
  async toggleActive(modelStr: string, isActive: boolean) {
    const existing = await this.prisma.appModel.findUnique({ where: { model: modelStr } });
    if (existing) {
      const configInfo = (existing.config as any) || {};
      configInfo.isActive = isActive;
      return this.prisma.appModel.update({
        where: { model: modelStr },
        data: { config: configInfo },
      });
    } else {
      // 本地如果不存在该模型，先查询 Plugin 的数据作为骨架在本地创建一个 Override 配置
      const pluginModels = await this.fetchFromPlugin() || [];
      const pluginModel = pluginModels.find((m: any) => m.model === modelStr);
      if (pluginModel) {
        return this.prisma.appModel.create({
          data: {
            model: modelStr,
            name: pluginModel.name || modelStr,
            type: pluginModel.type || 'llm',
            provider: pluginModel.provider || 'unknown',
            charsPointsPrice: pluginModel.charsPointsPrice || 0,
            config: { ...pluginModel, isActive }
          }
        });
      }
      return null;
    }
  }

  /**
   * 获取模型提供商列表
   */
  async getProviders() {
    const providerMap = await this.fetchProviderMap();
    const result = Object.entries(providerMap).map(([provider, info]) => ({
      provider,
      name: info.name || provider,
      avatar: info.avatar,
      order: info.order,
    }));

    if (result.length === 0 && !this.pluginBaseUrl) {
      const models = await this.prisma.appModel.findMany();
      const providers = Array.from(new Set(models.map(m => m.provider)));
      return providers.map(p => ({
        provider: p,
        name: p,
        avatar: '',
        order: 999
      }));
    }

    return result.sort((a, b) => a.order - b.order);
  }
}
