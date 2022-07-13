import { UUIDGenerator } from '@/domain/contracts/gateways'

export class UniqueId implements UUIDGenerator {
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
