import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('FacebookApi Integration Tests', () => {
  test('Should return a Facebook User if token is validd', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
    const fbUser = await sut.loadUser({ token: 'EAAHxmJqN8rMBAAuQdM1oSNU9tskyiDZA71wARAgRUEwFYLRtZCKbmPhuwTKqOkVHwiwDttUlzVFx8ZBmMVHbopE4c7O3Iuf6t2Q1HayqVtswWJ2NV0VlZBckKJesVW2ZBE4nMY7LLObcZC1SGotQojzv1ZBQ432fhymZAVMNvvKPIAJL35ifKe8dQHNaSPomp9gqQDShAumXqAZDZD' })
    expect(fbUser).toEqual({ facebookId: '111680431557057', email: 'clean_qeqxmfh_teste@tfbnw.net', name: 'clean arch teste' })
  })

  test('Should return a Facebook User if token is validd', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
    const fbUser = await sut.loadUser({ token: 'invalid' })
    expect(fbUser).toBeUndefined()
  })
})
