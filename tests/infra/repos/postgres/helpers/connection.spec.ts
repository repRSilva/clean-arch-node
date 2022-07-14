import { createConnection, getConnectionManager } from 'typeorm'

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnectionManager: jest.fn()
}))

class PgConnection {
  private constructor() { }
  private static instance?: PgConnection

  static getInstance(): PgConnection {
    if (PgConnection.instance === undefined) PgConnection.instance = new PgConnection()
    return PgConnection.instance
  }

  async connect(): Promise<void> {
    const connection = await createConnection()
    connection.createQueryRunner()
  }
}

describe('PgConnection', () => {
  test('Should have only one instance', () => {
    const sut = PgConnection.getInstance()
    const sut2 = PgConnection.getInstance()
    expect(sut).toBe(sut2)
  })

  test('Should create a new connection', async () => {
    const getConnectionManagerSpy = jest.fn().mockReturnValueOnce({ has: jest.fn().mockReturnValueOnce(false) })
    jest.mocked(getConnectionManager).mockImplementationOnce(getConnectionManagerSpy)
    const createQueryRunnerSpy = jest.fn()
    const createConnectionSpy = jest.fn().mockResolvedValueOnce({ createQueryRunner: createQueryRunnerSpy })
    jest.mocked(createConnection).mockImplementationOnce(createConnectionSpy)
    const sut = PgConnection.getInstance()
    await sut.connect()
    expect(createConnectionSpy).toHaveBeenCalledWith()
    expect(createConnectionSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })
})
