import { PgUserAccountRepository } from '@/infra/repos/postgres'

export const makeUserAccountRepo = (): PgUserAccountRepository => {
  return new PgUserAccountRepository()
}
