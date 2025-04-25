import { Knex } from "knex";
import { env } from "./src/env";

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
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

export default config;
