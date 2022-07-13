import { AuthenticationError } from '@/domain/entities/errors'
import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/use-cases'
import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways'
import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repos'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { mocked } from 'jest-mock'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/entities/facebook-account')

describe('FacebookAuthentication', () => {
  let facebookApi: MockProxy<LoadFacebookUser>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccount & SaveFacebookAccount>
  let sut: FacebookAuthentication
  let token: string

  beforeAll(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({ name: 'any_fb_name', email: 'any_fb_email', facebookId: 'any_fb_id' })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
    crypto = mock()
    crypto.generate.mockResolvedValue('any_generated_token')
    token = 'any_token'
  })

  beforeEach(() => {
    sut = setupFacebookAuthentication(facebookApi, userAccountRepo, crypto)
  })

  test('Should call LoadFacebookUser with correct params', async () => {
    await sut({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  test('Should throw AuthenticationError when LoadFacebookUser returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const promise = sut({ token })
    await expect(promise).rejects.toThrow(new AuthenticationError())
  })

  test('Should call LoadUserAccountRepo when LoadFacebookUser returns data', async () => {
    await sut({ token })
    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  test('Should call SaveFacebooAccountRepository with FacebookAccount', async () => {
    await sut({ token })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith(mocked(FacebookAccount).mock.instances[0])
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  test('Should call TokenGenerator with correct params', async () => {
    await sut({ token })
    expect(crypto.generate).toHaveBeenCalledWith({ key: 'any_account_id', expirationInMs: AccessToken.expirationInMs })
    expect(crypto.generate).toHaveBeenCalledTimes(1)
  })

  test('Should return an AccessToken on success', async () => {
    const authResult = await sut({ token })
    expect(authResult).toEqual({ accessToken: 'any_generated_token' })
  })

  test('Should rethrow if LoadFacebookUser throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))
    const promise = sut({ token })
    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  test('Should rethrow if LoadUserAccount throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))
    const promise = sut({ token })
    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  test('Should rethrow if SaveFacebookAccount throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut({ token })
    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  test('Should rethrow if TokenGenerator throws', async () => {
    crypto.generate.mockRejectedValueOnce(new Error('token_error'))
    const promise = sut({ token })
    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
