import { HttpGetClient } from '@/infra/http'
import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
  async get(params: HttpGetClient.Params): Promise<void> {
    await axios.get(params.url, { params: params.params })
  }
}

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient
  let fakeAxios: jest.Mocked<typeof axios>

  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>
  })

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  describe('get', () => {
    test('Shoul call get with correct params', async () => {
      await sut.get({ url: 'any_url', params: { any: 'any' } })
      expect(fakeAxios.get).toHaveBeenCalledWith('any_url', { params: { any: 'any' } })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})
