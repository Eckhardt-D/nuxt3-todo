import {createConnection, Connection} from 'mysql2';
import * as dotenv from 'dotenv';
import {join} from 'path';

dotenv.config({
  path: join(__dirname, '../.env'),
});

export interface ConnectionOptions {
  databaseUrl: string;
}

export const connect = async (options: ConnectionOptions): Promise<Connection> => {
  return createConnection(options.databaseUrl);
}

export const disconnect = (connection: Connection): void => {
  return connection.destroy()
}