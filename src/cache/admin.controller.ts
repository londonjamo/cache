import { Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { CacheService } from './cache.service';
import { Store } from './Store';

@Controller('admin')
export class AdminController {
    constructor(private readonly cacheService: CacheService) {}

    @Get('members')
    async getMembers() {
        let members = await this.cacheService.getMembers();
        console.error(members);
        const result = {}
        let membersJson = JSON.stringify(Object.fromEntries(members))
        console.error('got members admincontroller');  
  
        return membersJson;
    }

    @Get('vbuckets')
    getVBuckets() {
        let vbuckets = this.cacheService.getVBuckets();
        console.error(vbuckets);
        const result = {}
        for (let [key, value] of vbuckets) {
            console.log(key, value.toJSON());
            result[key] = value.toJSON()
        }
        console.error('got vbuckets admincontroller');  
  
        return result;
    }

    @Get('vbuckets/:id')
    getVBucket(@Param('id') id: string): Store {
        let vbucket = this.cacheService.getVBucket(id);
        console.error(vbucket);
        console.error('got one vbucket admincontroller');  
        let result = JSON.stringify(vbucket, null, 2);
        console.error(result);
        console.error('222 got one vbucket admincontroller');  
        return vbucket;
    }
}