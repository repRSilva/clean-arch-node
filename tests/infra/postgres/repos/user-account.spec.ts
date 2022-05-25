import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { PgUser } from '@/infra/postgres/entities'
import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser])
    backup = db.backup()
    pgUserRepo = getRepository(PgUser)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserAccountRepository()
  })

  describe('load', () => {
    test('Should return an account if email exist', async () => {
      await pgUserRepo.save({ email: 'existing_email' })
      const account = await sut.load({ email: 'existing_email' })
      expect(account).toEqual({ id: '1' })
    })

    test('Should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'existing_email' })
      expect(account).toBeUndefined()
    })
  })

  describe('saveWithFacebook', () => {
    test('should ', () => {

    })
  })
})
