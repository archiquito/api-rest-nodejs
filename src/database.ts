import { Knex, knex as setupKenex } from "knex";
import { env } from "./env";

export const config: Knex.Config = {
  client: "sqlite",
  connection:
    env.DATABASE_CLIENT === "sqlite"
      ? { filename: env.DATABASE_URL }
      : env.DATABASE_URL,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
  useNullAsDefault: true,
};

export const knex = setupKenex(config);
