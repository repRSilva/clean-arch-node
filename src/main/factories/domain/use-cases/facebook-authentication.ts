import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases'
import { makeFacebookApi, makeJwtTokenHandler } from '@/main/factories/infra/gateways'
import { makeUserAccountRepo } from '@/main/factories/infra/repos'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(makeFacebookApi(), makeUserAccountRepo(), makeJwtTokenHandler())
}
