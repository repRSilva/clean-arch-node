import { AuthenticationError } from '@/domain/entities/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/entities'
import { FacebookLoginController } from '@/application/controllers'
import { UnauthorizedError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validation'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/application/validation/composite')

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuth: MockProxy<FacebookAuthentication>
  let token: string

  beforeAll(() => {
    facebookAuth = mock()
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'))
    token = 'any_token'
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  test('Should build validators correctly', async () => {
    const validators = sut.buildValidators({ token })
    expect(validators).toEqual([new RequiredStringValidator('any_token', 'token')])
  })

  test('Should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token })
    expect(facebookAuth.perform).toHaveBeenCalledWith({ token })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })

  test('Should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token })
    expect(httpResponse).toEqual({ statusCode: 401, data: new UnauthorizedError() })
  })

  test('Should return 200 if authentication success', async () => {
    const httpResponse = await sut.handle({ token })
    expect(httpResponse).toEqual({ statusCode: 200, data: { accessToken: 'any_value' } })
  })
})
