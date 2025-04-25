import { knex as setupKenex } from "knex";
import { config } from '../knexfile';

export const knex = setupKenex(config);
