import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, CreateFacebookAccountRepository } from '@/data/contracts/repos'

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository
  ) { }

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookUserData = await this.facebookApi.loadUser(params)
    if (facebookUserData !== undefined) {
      await this.userAccountRepo.load({ email: facebookUserData.email })
      await this.userAccountRepo.createFromFacebook(facebookUserData)
    }
    return new AuthenticationError()
  }
}
