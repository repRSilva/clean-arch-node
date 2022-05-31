import { PgUserAccountRepository } from '@/infra/postgres/repos'

export const makeUserAccountRepo = (): PgUserAccountRepository => {
  return new PgUserAccountRepository()
}
