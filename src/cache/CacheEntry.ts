export class CacheEntry {
    key: string;
    value: string;
    expiration: number;

    constructor(key: string, value: string, expiration: number) {
        this.key = key;
        this.value = value;
        this.expiration = expiration;
    }

    
    toJSON(): object {
        return {
            key: this.key,
            value: this.value,
            expiration: this.expiration
        };
    }
}