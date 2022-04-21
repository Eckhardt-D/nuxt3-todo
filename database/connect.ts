import {PrismaClient} from '@prisma/client';

export interface ConnectionOptions {
  databaseUrl: string;
}

export const connect = async (options: ConnectionOptions): Promise<PrismaClient> => {
  return new PrismaClient();
}

export const disconnect = async (connection: PrismaClient): Promise<void> => {
  return connection.$disconnect()
}