import { UUIDHandler } from '@/infra/gateways'
import { mocked } from 'jest-mock'
import { v4 } from 'uuid'

jest.mock('uuid')

describe('UuidHandler', () => {
  let sut: UUIDHandler

  beforeAll(() => {
    mocked(v4).mockReturnValue('any_uuid')
  })
  beforeEach(() => {
    sut = new UUIDHandler()
  })

  test('Should call uuid', () => {
    sut.uuid({ key: 'any_key' })
    expect(v4).toHaveBeenCalledTimes(1)
  })

  test('Should return correct uuid', () => {
    const uuid = sut.uuid({ key: 'any_key' })
    expect(uuid).toBe('any_key_any_uuid')
  })
})
