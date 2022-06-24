import { AuthenticationError } from '@/domain/entities/errors'
import { FacebookLoginController, Controller } from '@/application/controllers'
import { UnauthorizedError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validation'

jest.mock('@/application/validation/composite')

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuth: jest.Mock
  let token: string

  beforeAll(() => {
    facebookAuth = jest.fn()
    facebookAuth.mockResolvedValue({ accessToken: 'any_value' })
    token = 'any_token'
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  test('Should extend controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  test('Should build validators correctly', async () => {
    const validators = sut.buildValidators({ token })
    expect(validators).toEqual([new RequiredStringValidator('any_token', 'token')])
  })

  test('Should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token })
    expect(facebookAuth).toHaveBeenCalledWith({ token })
    expect(facebookAuth).toHaveBeenCalledTimes(1)
  })

  test('Should return 401 if authentication fails', async () => {
    facebookAuth.mockRejectedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token })
    expect(httpResponse).toEqual({ statusCode: 401, data: new UnauthorizedError() })
  })

  test('Should return 200 if authentication success', async () => {
    const httpResponse = await sut.handle({ token })
    expect(httpResponse).toEqual({ statusCode: 200, data: { accessToken: 'any_value' } })
  })
})
