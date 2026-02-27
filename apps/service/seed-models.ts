/**
 * seed-models.ts
 *
 * 从 FastGPT Plugin 服务拉取标准模型列表，同步到 app_models 表。
 * 与 FastGPT 使用同一份模型数据源，无需维护本地 model.json。
 *
 * 用法: npm run seed:models
 * 环境变量:
 *   PLUGIN_BASE_URL  - FastGPT Plugin 服务地址，如 http://localhost:3003
 *   PLUGIN_TOKEN     - Plugin 服务 Token
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AppModelsService } from './src/models/app-models.service';
import axios from 'axios';

// ----------------------------------------------------------------
// 类型定义（对应 @fastgpt-sdk/plugin 的 model.list 返回类型）
// ----------------------------------------------------------------
interface PluginModelBase {
    type: 'llm' | 'embedding' | 'rerank' | 'tts' | 'stt';
    name: string;
    provider: string;
    model: string;
    charsPointsPrice?: number;
    inputPrice?: number;
    outputPrice?: number;
}

interface PluginLLMModel extends PluginModelBase {
    type: 'llm';
    maxContext: number;
    maxTokens: number;
    quoteMaxToken: number;
    maxTemperature: number | null;
    vision: boolean;
    reasoning: boolean;
    toolChoice: boolean;
    censor?: boolean;
    datasetProcess?: boolean;
    usedInClassify?: boolean;
    usedInExtractFields?: boolean;
    usedInToolCall?: boolean;
    useInEvaluation?: boolean;
    defaultSystemChatPrompt?: string;
    defaultConfig?: Record<string, any>;
    fieldMap?: Record<string, string>;
}

interface PluginEmbeddingModel extends PluginModelBase {
    type: 'embedding';
    defaultToken: number;
    maxToken: number;
    weight?: number;
    defaultConfig?: Record<string, any>;
    dbConfig?: Record<string, any>;
    queryConfig?: Record<string, any>;
}

interface PluginTTSModel extends PluginModelBase {
    type: 'tts';
    voices: { value: string; label: string }[];
}

type PluginModel = PluginLLMModel | PluginEmbeddingModel | PluginTTSModel | PluginModelBase;

// ----------------------------------------------------------------
// 从 Plugin 服务拉取模型列表
// ----------------------------------------------------------------
async function fetchModelsFromPlugin(): Promise<PluginModel[]> {
    const baseUrl = process.env.PLUGIN_BASE_URL;
    const token = process.env.PLUGIN_TOKEN;

    if (!baseUrl) {
        throw new Error('PLUGIN_BASE_URL 未配置，请在 .env 中添加该变量');
    }

    const url = `${baseUrl.replace(/\/$/, '')}/model/list`;
    console.log(`\n🔌 连接 FastGPT Plugin 服务: ${url}`);

    try {
        const response = await axios.get<PluginModel[]>(url, {
            headers: {
                ...(token ? { authtoken: token } : {}),
            },
            timeout: 10000,
        });

        if (response.status !== 200) {
            throw new Error(`Plugin 服务返回异常状态码: ${response.status}`);
        }

        const models = response.data;
        console.log(`✅ 成功获取 ${models.length} 个模型定义\n`);
        return models;
    } catch (error: any) {
        if (error.code === 'ECONNREFUSED') {
            throw new Error(
                `无法连接 Plugin 服务 (${url})，请确认服务已启动。\n` +
                `本地开发时可用 FastGPT 的 plugin 服务，通常运行在 http://localhost:3003`
            );
        }
        throw error;
    }
}

// ----------------------------------------------------------------
// 主流程
// ----------------------------------------------------------------
async function bootstrap() {
    // 加载 Plugin 模型列表（在 Nest 应用启动前，避免连接超时影响）
    const pluginModels = await fetchModelsFromPlugin();

    const app = await NestFactory.createApplicationContext(AppModule);
    const appModelsService = app.get(AppModelsService);

    console.log(`准备同步 ${pluginModels.length} 个模型到数据库...\n`);

    let successCount = 0;
    let failCount = 0;

    for (const model of pluginModels) {
        const { type, provider, model: modelId, name, charsPointsPrice, ...rest } = model;

        try {
            await appModelsService.create({
                type,
                provider,
                model: modelId,
                name,
                charsPointsPrice: charsPointsPrice ?? 0,
                config: rest,
            });

            const typeIcon: Record<string, string> = {
                llm: '🤖', embedding: '🔍', tts: '🔊', stt: '👂', rerank: '🔄'
            };
            console.log(`  ${typeIcon[type] ?? '📦'} [${type}] ${name} (${modelId})`);
            successCount++;
        } catch (e: any) {
            console.error(`  ✗ [${type}] ${name} (${modelId}): ${e.message}`);
            failCount++;
        }
    }

    console.log(`\n同步完成: 成功 ${successCount} 个, 失败 ${failCount} 个`);

    await app.close();
}

bootstrap().catch((err) => {
    console.error('\n❌ 同步失败:', err.message);
    process.exit(1);
});
