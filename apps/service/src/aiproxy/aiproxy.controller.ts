import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AiproxyService } from './aiproxy.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('core/aiproxy')
@UseGuards(AuthGuard('jwt'))
export class AiproxyController {
    constructor(private readonly aiproxyService: AiproxyService) { }

    @Get('channels/all')
    getChannelsAll(@Query() query: any) {
        return this.aiproxyService.proxyRequest('GET', '/channels/all', query);
    }

    @Get('channels/type_metas')
    getChannelsTypeMetas() {
        return this.aiproxyService.proxyRequest('GET', '/channels/type_metas');
    }

    @Post('createChannel')
    createChannel(@Body() body: any) {
        return this.aiproxyService.proxyRequest('POST', '/channel/', undefined, body);
    }

    @Post('channel/:id/status')
    updateChannelStatus(@Param('id') id: string, @Body() body: any) {
        return this.aiproxyService.proxyRequest('POST', `/channel/${id}/status`, undefined, body);
    }

    @Put('channel/:id')
    updateChannel(@Param('id') id: string, @Body() body: any) {
        return this.aiproxyService.proxyRequest('PUT', `/channel/${id}`, undefined, body);
    }

    @Delete('channel/:id')
    deleteChannel(@Param('id') id: string) {
        return this.aiproxyService.proxyRequest('DELETE', `/channel/${id}`);
    }
}
