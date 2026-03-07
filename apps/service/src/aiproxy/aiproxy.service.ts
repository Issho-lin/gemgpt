import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AiproxyService {
    private readonly baseUrl = process.env.AIPROXY_API_ENDPOINT || '';
    private readonly token = process.env.AIPROXY_API_TOKEN || '';
    private readonly logger = new Logger(AiproxyService.name);

    async proxyRequest(method: string, path: string, params?: any, data?: any) {
        if (!this.baseUrl || !this.token) {
            throw new HttpException('AIPROXY service config is missing', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // clean path
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        const url = `${this.baseUrl.replace(/\/$/, '')}${cleanPath}`;

        try {
            const response = await axios({
                method,
                url,
                params,
                data,
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error: any) {
            this.logger.error(`AIPROXY request failed: ${error.message} (${url})`);
            if (error.response) {
                throw new HttpException(error.response.data, error.response.status);
            }
            throw new HttpException('Internal Server Error from AIProxy', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Test a specific model through a specific channel.
     * References the 'Aiproxy-Channel' header to route the request to the target channel.
     */
    async testModel(channelId: number | undefined, model: string, modelType?: string) {
        if (!this.baseUrl || !this.token) {
            throw new HttpException('AIPROXY service config is missing', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // AIPROXY_API_ENDPOINT is the management API (e.g. http://host:3010/api)
        // The OpenAI-compatible endpoint is at the root (e.g. http://host:3010/v1/...)
        const openaiBase = this.baseUrl.replace(/\/api\/?$/, '');

        const headers: Record<string, string> = {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
        };
        if (channelId) {
            headers['Aiproxy-Channel'] = String(channelId);
        }

        try {
            const start = Date.now();

            if (modelType === 'embedding') {
                // Embedding 模型使用 /v1/embeddings
                const url = `${openaiBase}/v1/embeddings`;
                const response = await axios.post(url, {
                    model,
                    input: 'hi',
                }, { headers, timeout: 30000 });

                const embedding = response.data?.data?.[0]?.embedding;
                if (!Array.isArray(embedding) || embedding.length === 0) {
                    throw new HttpException('Embedding response is empty', HttpStatus.BAD_GATEWAY);
                }
                return { success: true, duration: Date.now() - start, dimensions: embedding.length };
            }

            if (modelType === 'rerank') {
                // Rerank 模型使用 /v1/rerank
                const url = `${openaiBase}/v1/rerank`;
                const response = await axios.post(url, {
                    model,
                    query: 'hi',
                    documents: ['hello world'],
                }, { headers, timeout: 30000 });

                const results = response.data?.results;
                if (!Array.isArray(results)) {
                    throw new HttpException('Rerank response is empty', HttpStatus.BAD_GATEWAY);
                }
                return { success: true, duration: Date.now() - start };
            }

            // 默认：LLM / tts / stt 等，统一使用 /v1/chat/completions
            const url = `${openaiBase}/v1/chat/completions`;
            const response = await axios.post(url, {
                model,
                messages: [{ role: 'user', content: 'hi' }],
                max_tokens: 10,
                stream: false,
            }, { headers, timeout: 30000 });

            const duration = Date.now() - start;
            const content = response.data?.choices?.[0]?.message?.content;
            if (!content && content !== '') {
                throw new HttpException('Model response is empty', HttpStatus.BAD_GATEWAY);
            }
            return { success: true, duration, content };
        } catch (error: any) {
            this.logger.error(`testModel failed [channel=${channelId}, model=${model}, type=${modelType}]: ${error.message}`);
            if (error.response) {
                const errMsg = error.response.data?.error?.message
                    || error.response.data?.message
                    || JSON.stringify(error.response.data);
                throw new HttpException(errMsg, error.response.status);
            }
            throw new HttpException(error.message || 'Test failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
