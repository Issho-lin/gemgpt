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
}
