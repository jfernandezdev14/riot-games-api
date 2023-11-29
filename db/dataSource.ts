import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { join } from 'path';

let connectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? +process.env.DB_PORT : 5432, // Don't forget to cast to number with +
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  migrationsRun: true,
  migrations: [join(__dirname, './../db/migrations/{.ts,*.js}')],
  entities: [join(__dirname, './../**/*.entity.js')],
  ssl: {
    rejectUnauthorized: false,
  },
};

export default new DataSource({
  ...connectionOptions,
});
