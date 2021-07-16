import 'reflect-metadata';
import { createConnection, Connection, ConnectionOptions } from 'typeorm';
import { join } from 'path';
const parentDir = join(__dirname, '..');

const connectionOpts: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'isrc-metadata',
  entities: [
    `${parentDir}/**/*.entity.ts`,
  ],
  synchronize: true,
};

const connectToDb = async () => {
  let retries = 5;
  let connection:Connection;

  while (retries) {
    try {
      connection = await createConnection(connectionOpts);
      break;
    } catch (err) {
      console.log(err);
      retries -= 1;
      console.log(`retries left: ${retries}`);
      await new Promise<void>(res => setTimeout(res, 5000));
    }
  }

  if (!connection) {
    throw new Error('error connecting to the DB');
  }

  return connection;
};

export default connectToDb;
