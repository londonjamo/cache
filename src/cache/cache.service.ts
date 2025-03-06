import { Injectable, Logger } from '@nestjs/common';
import { Store } from './Store';
import { CacheEntry } from './CacheEntry';
import { VBucketManager } from './VBucketManager';
import { MembershipService } from './MembershipService';

@Injectable()
export class CacheService {
    private readonly logger = new Logger(CacheService.name, { timestamp: true });

    vbucketManager: VBucketManager;
    membershipService: MembershipService;
    constructor() {
        console.error('cache service');
        this.vbucketManager = new VBucketManager();
        this.vbucketManager.initializeBuckets();
        this.membershipService = new MembershipService();
        this.init();
    }
    
    async init() {
        this.logger.log('joining quorum');
        await this.membershipService.join();
    }

    get(key: string) {
        let store = this.vbucketManager.getStore(key);
        if (!store) { return undefined}
        let value = store.get(key);
        this.logger.debug(`get ${key}: ${value}`);
        return value;
    }

    set(key: string, value: string) { 
        let store = this.vbucketManager.getStore(key);
        if (!store) {return undefined}
        this.logger.debug(`set(${store}) ${key}: ${value}`);

        return store.set(key, value);
    }

    has(key: string): boolean {
        let store = this.vbucketManager.getStore(key);
        if (!store) { return false}
        return store.has(key);
    }

    delete(key: string): void {
        let store = this.vbucketManager.getStore(key);
        if (!store) { return undefined}
        this.logger.debug(`delete(${store}) ${key}`);
        store.delete(key);
    }

    clear(key: string): void {
        let store = this.vbucketManager.getStore(key);
        if (!store) { return undefined}
        store.clear();
    }

    getVBuckets() {
        let vbuckets =  this.vbucketManager.getAllStores();

        return vbuckets;
    }   

    getVBucket(id: string) {
        let vbucket =  this.vbucketManager.getStoreById(id);
        console.error(vbucket);
        console.error('got one vbucket cacehservice');  
        return vbucket;
    }

    async getMembers(): Promise<Map<string, string>> {
        let members = await this.membershipService.getMembers();  
        console.error(members);
        console.error('got one vbucket cacehservice');  
        return members;
    }
}
