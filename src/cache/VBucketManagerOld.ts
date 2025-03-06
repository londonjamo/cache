import { VBucket } from "./VBucket";
import { Store } from "./Store";

export class VBucketManagerOld {
    private vbuckets: Map<string, VBucket>;

    constructor() {
        this.vbuckets= new Map<string, VBucket>();
    }

    initializeBuckets() {
        for (let i = 0; i < 26; i++) {
            let vbucket = new VBucket();
            this.vbuckets.set(i.toString(), vbucket); 
            vbucket.addStore(i.toString(), new Store());
        }
        console.error(this.vbuckets);
    }

    getVBucket(key: string): VBucket {
        let hashedKey = this.hash(key).toString()
        console.error('getting vbucket');
        console.error(hashedKey);
        if (!this.vbuckets.has(hashedKey)) {
            console.error('creating vbucket');
            this.vbuckets.set(hashedKey, new VBucket());
        }
        return this.vbuckets.get(hashedKey) as VBucket;
    }
    getAllVbuckets(): Map<string, VBucket> {
        console.error('getting all vbuckets');
        console.error(this.vbuckets);
        console.error('got them!! all vbuckets');

        return this.vbuckets;
    }

    hash(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash += str.charCodeAt(i);
        }
        return hash % 10;
      }
}       