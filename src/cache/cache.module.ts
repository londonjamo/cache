import { Module } from '@nestjs/common';
import { CacheController } from './cache.controller';
import { CacheService } from './cache.service';
import { AdminController } from './admin.controller';

@Module({
  controllers: [CacheController,AdminController],
  providers: [CacheService]
})
export class CacheModule {}
