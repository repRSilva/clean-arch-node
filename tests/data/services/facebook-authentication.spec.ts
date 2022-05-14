import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services'

describe('FacebookAuthenticationService', () => {
  test('Should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = { loadUser: jest.fn() }
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  test('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = { loadUser: jest.fn() }
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
