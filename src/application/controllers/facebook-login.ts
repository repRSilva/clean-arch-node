import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse, badRequest, unauthorized, serverError, ok } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { RequiredFieldError } from '@/application/errors'

type HttpRequest = {
  token: string | null | undefined
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) { }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return badRequest(new RequiredFieldError('token'))
      }

      const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token })
      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value })
      } else {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
