import { UUIDGenerator } from '@/domain/contracts/gateways'
import { v4 } from 'uuid'

jest.mock('uuid')

class UUIDHandler {
  uuid({ key }: UUIDGenerator.Input): void {
    v4()
  }
}

describe('UuidHandler', () => {
  test('Should call uuid', () => {
    const sut = new UUIDHandler()
    sut.uuid({ key: 'any_key' })
    expect(v4).toHaveBeenCalledTimes(1)
  })
})
