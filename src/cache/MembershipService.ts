import { Logger } from '@nestjs/common';
import { connected } from 'process';
import { ZKClient } from './ZKClient';

export class MembershipService {
    private readonly logger = new Logger(MembershipService.name, { timestamp: true });

    private zkClient: ZKClient;
    constructor() {
         this.zkClient = new ZKClient();
    }

/**
 * Joins the cache cluster by connecting to the ZooKeeper server
 * and creating an ephemeral sequential node under the '/members/cache-' path.
 * The node's data will include the current application's port.
 * 
 * This method first establishes a connection to the ZooKeeper server
 * using the ZKClient instance. After a successful connection,
 * it creates a node with the path '/members/cache-' followed by 
 * a unique sequential number assigned by ZooKeeper.
 * 
 * @returns A promise that resolves once the node is created.
 * @throws An error if the connection to ZooKeeper fails or the node creation fails.
 */
    async join(): Promise<void> {
        let port = ''+process.env.PORT;
        this.logger.log('joing cluster on port:${port}');

        await this.zkClient.connect();        
        await this.zkClient.createNode('/members/cache-',port);
    }
      
    /**
     * Gets the current members of the cache cluster.
     * 
     * @returns A Map where the key is the name of the cache node and the value is its port.
     * 
     * @remarks
     * This function returns a Promise that resolves with the current members of the cluster.
     * The Promise will reject if there is an error in connecting to ZooKeeper or in reading the members.
     * 
     */
    async getMembers(): Promise<Map<string, string>> {
        await this.zkClient.client.connect;
        this.zkClient.connected = true;
        let result = new Map<string, string>();
        let children = await this.zkClient.getChildren('/members');
        for(let child of children) {
            let data = await this.zkClient.getData('/members/'+child);
            this.logger.debug('member: ', child, data);  
            let sdata = '';
            if (data) {
                sdata = data.toString();
                this.logger.debug('member: ', child, sdata);  
            }
            result.set(child, sdata);
        }
        this.logger.log('members: ', JSON.stringify(Object.fromEntries(result)));                            

        return result
    }
}    