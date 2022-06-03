import { JwtTokenHandler } from '@/infra/crypto'
import jwt from 'jsonwebtoken'
jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let secret: string
  let sut: JwtTokenHandler
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret)
  })

  describe('generateToken', () => {
    let key: string
    let expirationInMs: number
    let token: string

    beforeAll(() => {
      key = 'any_key'
      expirationInMs = 1000
      token = 'any_token'
      fakeJwt.sign.mockImplementation(() => token)
    })

    test('Should call sign with correct params', async () => {
      await sut.generateToken({ key, expirationInMs })
      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
    })

    test('Should return a token', async () => {
      const generatedToken = await sut.generateToken({ key, expirationInMs })
      expect(generatedToken).toBe(token)
    })

    test('Shoul rethrow if sign throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })
      const promise = sut.generateToken({ key, expirationInMs })
      await expect(promise).rejects.toThrow(new Error('token_error'))
    })
  })
})
