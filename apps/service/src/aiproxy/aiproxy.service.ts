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
    async testModel(channelId: number, model: string) {
        if (!this.baseUrl || !this.token) {
            throw new HttpException('AIPROXY service config is missing', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // AIPROXY_API_ENDPOINT is the management API (e.g. http://host:3010/api)
        // The OpenAI-compatible endpoint is at the root (e.g. http://host:3010/v1/chat/completions)
        const openaiBase = this.baseUrl.replace(/\/api\/?$/, '');
        const url = `${openaiBase}/v1/chat/completions`;

        try {
            const start = Date.now();
            const response = await axios.post(url, {
                model,
                messages: [{ role: 'user', content: 'hi' }],
                max_tokens: 10,
                stream: false,
            }, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                    'Aiproxy-Channel': String(channelId),
                },
                timeout: 30000,
            });

            const duration = Date.now() - start;
            const content = response.data?.choices?.[0]?.message?.content;
            if (!content && content !== '') {
                throw new HttpException('Model response is empty', HttpStatus.BAD_GATEWAY);
            }
            return { success: true, duration, content };
        } catch (error: any) {
            this.logger.error(`testModel failed [channel=${channelId}, model=${model}]: ${error.message}`);
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
