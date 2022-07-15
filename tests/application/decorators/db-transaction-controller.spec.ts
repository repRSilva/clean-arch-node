import { mock, MockProxy } from 'jest-mock-extended'
import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'

class DbTransactionController {
  constructor(private readonly decoratee: Controller, private readonly db: DbTransaction) { }
  async perform(httpRequest: any): Promise<HttpResponse | undefined> {
    await this.db.openTransaction()
    try {
      const httpResponse = await this.decoratee.perform(httpRequest)
      await this.db.commit()
      return httpResponse
    } catch (error) {
      await this.db.rollback()
    } finally {
      await this.db.closeTransaction()
    }
  }
}

interface DbTransaction {
  openTransaction: () => Promise<void>
  closeTransaction: () => Promise<void>
  commit: () => Promise<void>
  rollback: () => Promise<void>
}

describe('DbTransactionController', () => {
  let db: MockProxy<DbTransaction>
  let decoratee: MockProxy<Controller>
  let sut: DbTransactionController

  beforeAll(() => {
    db = mock()
    decoratee = mock()
    decoratee.perform.mockResolvedValue({ statusCode: 204, data: null })
  })

  beforeEach(() => {
    sut = new DbTransactionController(decoratee, db)
  })

  test('Should open transaction', async () => {
    await sut.perform({ any: 'any' })
    expect(db.openTransaction).toHaveBeenCalledWith()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
  })

  test('Should execute decoratee', async () => {
    await sut.perform({ any: 'any' })
    expect(decoratee.perform).toHaveBeenCalledWith({ any: 'any' })
    expect(decoratee.perform).toHaveBeenCalledTimes(1)
  })

  test('Should call commit and close transaction on sucess', async () => {
    await sut.perform({ any: 'any' })
    expect(db.rollback).not.toHaveBeenCalled()
    expect(db.commit).toHaveBeenCalledWith()
    expect(db.commit).toHaveBeenCalledTimes(1)
    expect(db.closeTransaction).toHaveBeenCalledWith()
    expect(db.closeTransaction).toHaveBeenCalledTimes(1)
  })

  test('Should call rollback and close transaction on failure', async () => {
    decoratee.perform.mockRejectedValueOnce(new Error('decoratee_error'))
    await sut.perform({ any: 'any' })
    expect(db.commit).not.toHaveBeenCalled()
    expect(db.rollback).toHaveBeenCalledWith()
    expect(db.rollback).toHaveBeenCalledTimes(1)
    expect(db.closeTransaction).toHaveBeenCalledWith()
    expect(db.closeTransaction).toHaveBeenCalledTimes(1)
  })

  test('Should return same result as decoratee on success', async () => {
    const httpResponse = await sut.perform({ any: 'any' })
    expect(httpResponse).toEqual({ statusCode: 204, data: null })
  })
})
