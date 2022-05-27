import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'
import { FacebookLoginController } from '@/application/controllers'
import { ServerError, UnauthorizedError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validation'
import { mocked } from 'jest-mock'

jest.mock('@/application/validation/required-string')

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

  test('Should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const RequireStringValidatorSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    mocked(RequiredStringValidator).mockImplementationOnce(RequireStringValidatorSpy)
    const httpResponse = await sut.handle({ token })
    expect(httpResponse).toEqual({ statusCode: 400, data: error })
    expect(RequiredStringValidator).toHaveBeenCalledWith('any_token', 'token')
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

  test('Should return 500 if authentication throws', async () => {
    const error = new Error('infra_error')
    facebookAuth.perform.mockRejectedValueOnce(error)
    const httpResponse = await sut.handle({ token })
    expect(httpResponse).toEqual({ statusCode: 500, data: new ServerError(error) })
  })
})