import { Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller('cache')
export class CacheController {
    constructor(private readonly cacheService: CacheService) {}


    @Get(':key')
    get(@Param ('key') key: string) {
        return this.cacheService.get(key);
    }

    @Put(':key/:value')
    put(@Param ('key') key: string, @Param ('value') value: string) {
        return this.cacheService.set(key, value);
    }

    @Delete(':key')
    delete(@Param ('key') key: string) {
        return this.cacheService.delete(key);
    }

}
