import Prisma from '@prisma/client';
const {PrismaClient} = Prisma;

export const connect = (): Prisma.PrismaClient => {
  return new PrismaClient();
}

export const disconnect = async (connection: Prisma.PrismaClient): Promise<void> => {
  return connection.$disconnect()
}