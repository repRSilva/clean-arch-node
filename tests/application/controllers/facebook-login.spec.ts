import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'
import { FacebookLoginController } from '@/application/controllers'
import { ServerError, RequiredFieldError, UnauthorizedError } from '@/application/errors'

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuth: MockProxy<FacebookAuthentication>

  beforeAll(() => {
    facebookAuth = mock()
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'))
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  test('Should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({ token: '' })
    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('token') })
  })

  test('Should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: null as any })
    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('token') })
  })

  test('Should return 400 if token is undefined', async () => {
    const httpResponse = await sut.handle({ token: undefined as any })
    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('token') })
  })

  test('Should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })

  test('Should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token: 'any_token' })
    expect(httpResponse).toEqual({ statusCode: 401, data: new UnauthorizedError() })
  })

  test('Should return 200 if authentication success', async () => {
    const httpResponse = await sut.handle({ token: 'any_token' })
    expect(httpResponse).toEqual({ statusCode: 200, data: { accessToken: 'any_value' } })
  })

  test('Should return 500 if authentication throws', async () => {
    const error = new Error('infra_error')
    facebookAuth.perform.mockRejectedValueOnce(error)
    const httpResponse = await sut.handle({ token: 'any_token' })
    expect(httpResponse).toEqual({ statusCode: 500, data: new ServerError(error) })
  })
})
