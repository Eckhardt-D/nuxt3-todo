
import { PrismaClient } from "@prisma/client";
import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "vitest";

import {connect, disconnect} from './connect';

describe('Database Connection', () => {
  let connection: PrismaClient;
  
  beforeEach(() => {
    connection = connect()
  })

  afterEach(async () => {
    await disconnect(connection);
  })

  test('successfully connects', () => {
    expect(connection).toBeInstanceOf(PrismaClient);
  })
})