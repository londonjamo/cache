import { get } from 'http';
import { Logger } from '@nestjs/common';
import * as zk from 'node-zookeeper-client';
import {type Client} from 'node-zookeeper-client'


export class ZKClient {
  private readonly logger = new Logger(ZKClient.name, { timestamp: true });

  public client: Client;
  public connected = false;

  constructor() { // TODO remove hardcoded zookeeper config
    let zHost = process.env.ZOOKEEPER_HOST ?? 'localhost';
    let zPort = process.env.ZOOKEEPER_PORT ?? '2181';
    this.logger.log(`connecting to zk at ${zHost}:${zPort}`);
    this.client = zk.createClient(`${zHost}:${zPort}`,{ sessionTimeout: 10000 });
    this.client.connect
  }

  /**
   * Connect to the ZooKeeper server.
   *
   * This function returns a Promise that resolves when the client is connected,
   * or rejects if the connection fails. The promise will reject after 20 seconds
   * if the client is not connected.
   *
   * The client will emit 'connected' once connected. The client will also emit
   * 'disconnected' if the connection is lost.
   */
  public async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const connectTimeout = setTimeout(() => {
        this.logger.error('failed to connect in time');
        return reject();
      }, 20000);
      this.client.once('connected', () => {
        clearTimeout(connectTimeout);
        this.connected = true;
        return resolve();
      });
      this.client.connect();
    });
  }

  /**
   * Create a new node with the given path and data.
   *
   * The node will be created with `EPHEMERAL_SEQUENTIAL` mode, meaning that
   * the node will be removed when the client disconnects, and ZooKeeper will
   * assign a unique sequential number to the node.
   *
   * This function returns a Promise that resolves with the path of the created
   * node, or rejects if the creation fails.
   *
   * The client must be connected before calling this function. If the client is
   * not connected, the function will throw an error.
   */
  public async createNode(path: string, data: string): Promise<string> {
    if (!this.connected) {
      throw new Error('must connect first');
    }
    return new Promise((resolve, reject) => {
      this.client.create(path, Buffer.from(data), zk.CreateMode.EPHEMERAL_SEQUENTIAL,(error,path) => {
        if (error) {
            this.logger.error(`failed to connect in time ${error}`);
            return reject(error);
        }
        this.logger.log(`created ${path}`);
        return resolve(path);
      })
    })
  }

  /**
   * Retrieve the children nodes of a given node path.
   *
   * This function returns a Promise that resolves with an array of child node names,
   * or rejects if the retrieval fails. The client must be connected before calling 
   * this function. If the client is not connected, the function will throw an error.
   *
   * @param path - The path of the node whose children are to be retrieved.
   * @returns A Promise that resolves to an array of strings, each representing a child node name.
   * @throws An error if the client is not connected.
   */

  public async getChildren(path: string): Promise<string[]> {
    if (!this.connected) {
      throw new Error('must connect first');
    }
    return new Promise((resolve, reject) => {
        this.client.getChildren(path, function(event){console.log(event)}, (error, children, stat) => {
        if (error) {
          this.logger.log('rejected', error);
          return reject(error);
        }
        this.logger.log('got children: ', children);
        return resolve(children);
      })
    })
  }

  /**
   * Retrieve the data of a given node path.
   *
   * This function returns a Promise that resolves with the data as a Buffer,
   * or rejects if the retrieval fails. The client must be connected before
   * calling this function. If the client is not connected, the function will
   * throw an error.
   *
   * @param path - The path of the node whose data is to be retrieved.
   * @returns A Promise that resolves to a Buffer containing the node's data.
   * @throws An error if the client is not connected.
   */

  public async getData(path: string): Promise<Buffer> {
    if (!this.connected) {
      throw new Error('must connect first');
    }
    return new Promise((resolve, reject) => {
        this.client.getData(path, (error, data, stat) => {
        if (error) {
          this.logger.log('rejected', error);
          return reject(error);
        }
        this.logger.log('data: ', data);
        return resolve(data);
      })
    })
  }

  print(event: Event) {
    console.log(event);
}

  /**
   * Disconnect the ZooKeeper client.
   *
   * After calling this method, the client is no longer connected to ZooKeeper, and
   * any subsequent calls to methods that require a connection will throw an error.
   */
  public disconnect() {
    this.client.close();
  }
}