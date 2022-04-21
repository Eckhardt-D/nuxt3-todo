
import { PrismaClient } from "@prisma/client";
import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
} from "vitest";

import {connect, disconnect} from './connect';

describe('Database Connection', () => {
  let connection: PrismaClient;
  
  beforeEach(async () => {
    connection = await connect({
      databaseUrl: process.env.DATABASE_URL,
    })
  })

  afterEach(async () => {
    await disconnect(connection);
  })

  test('successfully connects', () => {
    expect(connection).toBeInstanceOf(PrismaClient);
  })
})