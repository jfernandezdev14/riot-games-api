// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PRT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  migrationsRun: true,
  migrations: ['db/migrations/*.ts'],
  entities: ['entities/*.ts'],
  ...(process.env.DB_SSL && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
  cli: {
    migrationsDir: 'db/migrations',
  },
};
