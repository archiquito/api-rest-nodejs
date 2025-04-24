import { Knex } from 'knex' // eslint-disable-line

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
      type: 'credit' | 'debit'
    }
  }
}
