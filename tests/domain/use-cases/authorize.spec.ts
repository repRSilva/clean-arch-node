import { mock, MockProxy } from 'jest-mock-extended'

export interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => Promise<TokenValidator.Result>
}

export namespace TokenValidator {
  export type Params = { token: string }
  export type Result = string
}

type Input = { token: string }
type Output = string
type Authorize = (params: Input) => Promise<Output>
type Setup = (crypto: TokenValidator) => Authorize

const setupAuthorize: Setup = crypto => async params => {
  return await crypto.validateToken(params)
}

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
    crypto.validateToken.mockResolvedValue('any_value')
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })

  test('Should call TokenValidator with correct params', async () => {
    await sut({ token })
    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })

  test('Should return the correct accessToken', async () => {
    const userId = await sut({ token })
    expect(userId).toBe('any_value')
  })
})
