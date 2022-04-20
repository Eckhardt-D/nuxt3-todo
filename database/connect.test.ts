import { Connection, QueryError } from "mysql2";
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
  let connection: Connection;
  
  beforeEach(async () => {
    connection = await connect({
      databaseUrl: process.env.DATABASE_URL,
    })
  })

  afterEach(() => {
    disconnect(connection);
  })

  test('successfully connects', (done) => {
    connection.ping((err: QueryError) => {
      expect(err).toBeUndefined()
      return done();
    })
  })
})