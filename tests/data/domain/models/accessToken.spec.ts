import { AccessToken } from '@/domain/models'

describe('AccessToken', () => {
  test('Should create with a value', () => {
    const sut = new AccessToken('any_value')
    expect(sut).toEqual({ value: 'any_value' })
  })

  test('Should expire in 1800000 ms', () => {
    expect(AccessToken.expirationInMs).toBe(1800000)
  })
})
