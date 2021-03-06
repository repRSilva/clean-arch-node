import { PgUserAccountRepository } from '@/infra/repos/postgres'
import { PgUser } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
import { IBackup } from 'pg-mem'
import { getConnection, getRepository, Repository } from 'typeorm'

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
    test('Should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({ email: 'any_email', name: 'any_name', facebookId: 'any_fb_id' })
      const pgUser = await pgUserRepo.findOne({ email: 'any_email' })
      expect(pgUser?.id).toBe(1)
      expect(id).toBe('1')
    })

    test('Should update account if id is defined', async () => {
      await pgUserRepo.save({ email: 'any_email', name: 'any_name', facebookId: 'any_fb_id' })
      const { id } = await sut.saveWithFacebook({ id: '1', email: 'new_email', name: 'new_name', facebookId: 'new_fb_id' })
      const pgUser = await pgUserRepo.findOne({ id: 1 })
      expect(pgUser).toMatchObject({ id: 1, email: 'any_email', name: 'new_name', facebookId: 'new_fb_id' })
      expect(id).toBe('1')
    })
  })
})
