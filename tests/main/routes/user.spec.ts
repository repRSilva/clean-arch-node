import { app } from '@/main/config/app'
import { PgUser } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks'
import { env } from '@/main/config/env'
import { PgConnection } from '@/infra/repos/postgres/helpers'
import { IBackup } from 'pg-mem'
import { Repository } from 'typeorm'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

describe('User Routes', () => {
  let connection: PgConnection
  let backup: IBackup
  let pgUserRepo: Repository<PgUser>

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb([PgUser])
    backup = db.backup()
    pgUserRepo = connection.getRepository(PgUser)
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  beforeEach(() => {
    backup.restore()
  })

  describe('DELETE /users/picture', () => {
    test('Should return 403 if no authorization header is present', async () => {
      const { status } = await request(app).delete('/api/users/picture')
      expect(status).toBe(403)
    })

    test('Should return 200 with valid data', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email', name: 'Rafael Silva' })
      const authorization = sign({ key: id }, env.jwtSecret)
      const { status, body } = await request(app).delete('/api/users/picture').set({ authorization })
      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: undefined, initials: 'RS' })
    })
  })

  describe('PUT /users/picture', () => {
    const uploadSpy = jest.fn()
    jest.mock('@/infra/gateways/aws-s3-file-storage', () => ({
      AwsS3FileStorage: jest.fn().mockReturnValue({ upload: uploadSpy })
    }))

    test('Should return 403 if no authorization header is present', async () => {
      const { status } = await request(app).put('/api/users/picture')
      expect(status).toBe(403)
    })

    test('Should return 200 with valid data', async () => {
      uploadSpy.mockResolvedValueOnce('any_picture_url')
      const { id } = await pgUserRepo.save({ email: 'any_email', name: 'Rafael Silva' })
      const authorization = sign({ key: id }, env.jwtSecret)
      const { status, body } = await request(app).put('/api/users/picture').set({ authorization })
        .attach('picture', Buffer.from('any_buffer'), { filename: 'any_file_name', contentType: 'image/png' })
      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: 'any_picture_url', initials: undefined })
    })
  })
})
