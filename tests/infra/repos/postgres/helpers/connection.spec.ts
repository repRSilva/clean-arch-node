
class PgConnection {
  private constructor() { }
  private static instance?: PgConnection

  static getInstance(): PgConnection {
    if (PgConnection.instance === undefined) PgConnection.instance = new PgConnection()
    return PgConnection.instance
  }

  connect(): void {

  }
}

describe('PgConnection', () => {
  test('Should have only one instance', () => {
    const sut = PgConnection.getInstance()
    const sut2 = PgConnection.getInstance()
    expect(sut).toBe(sut2)
  })
})
