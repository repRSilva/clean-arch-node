import { PgUserProfileRepository } from '@/infra/repos/postgres'

export const makeUserProfileRepo = (): PgUserProfileRepository => {
  return new PgUserProfileRepository()
}
