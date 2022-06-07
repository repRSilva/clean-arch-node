import { UUIDGenerator } from '@/domain/contracts/gateways'

class UniqueId implements UUIDGenerator {
  constructor(private readonly date: Date) { }
  uuid({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    const year = this.date.getFullYear()
    const month = (this.date.getMonth() + 1).toString().padStart(2, '0')
    const date = this.date.getDate().toString().padStart(2, '0')
    const hours = this.date.getHours().toString().padStart(2, '0')
    const minutes = this.date.getMinutes().toString().padStart(2, '0')
    const seconds = this.date.getSeconds().toString().padStart(2, '0')

    return `${key}_${year}${month}${date}${hours}${minutes}${seconds}`
  }
}

describe('UniqueId', () => {
  test('Should call uuid', () => {
    const sut = new UniqueId(new Date(2021, 9, 3, 10, 10, 10))
    const uuid = sut.uuid({ key: 'any_key' })
    expect(uuid).toBe('any_key_20211003101010')
  })

  test('Should call uuid', () => {
    const sut = new UniqueId(new Date(2018, 2, 10, 18, 1, 0))
    const uuid = sut.uuid({ key: 'any_key' })
    expect(uuid).toBe('any_key_20180310180100')
  })
})
