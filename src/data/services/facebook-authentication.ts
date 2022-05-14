import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, CreateFacebookAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repos'

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository
  ) { }

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookUserData = await this.facebookApi.loadUser(params)
    if (facebookUserData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: facebookUserData.email })
      if (accountData?.name !== undefined) {
        await this.userAccountRepo.updateWithFacebook({ id: accountData.id, name: accountData.name, facebookId: facebookUserData.facebookId })
      } else {
        await this.userAccountRepo.createFromFacebook(facebookUserData)
      }
    }
    return new AuthenticationError()
  }
}
