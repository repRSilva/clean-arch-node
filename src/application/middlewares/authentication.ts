import { Authorize } from '@/domain/use-cases'
import { ok, forbidden, HttpResponse } from '@/application/helpers'
import { RequiredStringValidator } from '@/application/validation'

type HttpRequest = { authorization: string }
type Model = Error | { userId: string }
export class AuthenticationMiddleware {
  constructor(private readonly authorize: Authorize) { }
  async handle({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    if (this.validate({ authorization }) === false) return forbidden()
    try {
      const userId = await this.authorize({ token: authorization })
      return ok({ userId })
    } catch {
      return forbidden()
    }
  }

  private validate({ authorization }: HttpRequest): Boolean {
    const error = new RequiredStringValidator(authorization, 'authorization').validate()
    return error === undefined
  }
}
