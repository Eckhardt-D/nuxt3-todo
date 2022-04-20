import { Connection } from "mysql2";
import Query from "mysql2/typings/mysql/lib/protocol/sequences/Query";
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
    connection.ping((err: Query.QueryError) => {
      expect(err).toBeUndefined()
      return done();
    })
  })
})