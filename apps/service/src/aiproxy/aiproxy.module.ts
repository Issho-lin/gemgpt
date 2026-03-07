import { Module } from '@nestjs/common';
import { AiproxyController } from './aiproxy.controller';
import { AiproxyService } from './aiproxy.service';

@Module({
  controllers: [AiproxyController],
  providers: [AiproxyService],
  exports: [AiproxyService],
})
export class AiproxyModule {}
