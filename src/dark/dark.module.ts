import { Module } from '@nestjs/common';
import { DarkService } from './dark.service';
import { DarkController } from './dark.controller';

@Module({
  controllers: [DarkController],
  providers: [DarkService]
})
export class DarkModule {}
