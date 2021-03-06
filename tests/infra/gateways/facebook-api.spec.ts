import { HttpGetClient, FacebookApi } from '@/infra/gateways'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookApi', () => {
  let clientId: string
  let clientSecret: string
  let sut: FacebookApi
  let httpClient: MockProxy<HttpGetClient>

  beforeAll(() => {
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
    httpClient = mock()
  })

  beforeEach(() => {
    sut = new FacebookApi(httpClient, clientId, clientSecret)
    httpClient.get
      .mockResolvedValueOnce({ access_token: 'any_app_token' })
      .mockResolvedValueOnce({ data: { user_id: 'any_user_id' } })
      .mockResolvedValueOnce({ id: 'any_fb_id', name: 'any_fb_name', email: 'any_fb_email' })
  })

  test('Should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' })
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: { client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials' }
    })
  })

  test('Should get debug token', async () => {
    await sut.loadUser({ token: 'any_client_token' })
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: { access_token: 'any_app_token', input_token: 'any_client_token' }
    })
  })

  test('Should get user info', async () => {
    await sut.loadUser({ token: 'any_client_token' })
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id',
      params: { fields: 'id,name,email', access_token: 'any_client_token' }
    })
  })

  test('Should return facebook user', async () => {
    const facebookUser = await sut.loadUser({ token: 'any_client_token' })
    expect(facebookUser).toEqual({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    })
  })

  test('Should return undefined if HttpGetClient throws', async () => {
    httpClient.get.mockReset().mockRejectedValueOnce(new Error('fb_error'))
    const facebookUser = await sut.loadUser({ token: 'any_client_token' })
    expect(facebookUser).toBeUndefined()
  })
})
