import { ok, forbidden, HttpResponse } from '@/application/helpers'
import { RequiredString } from '@/application/validation'
import { Middleware } from '@/application/middlewares'

type HttpRequest = { authorization: string }
type Model = Error | { userId: string }
type Authorize = (input: { token: string }) => Promise<string>

export class AuthenticationMiddleware implements Middleware {
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
    const error = new RequiredString(authorization, 'authorization').validate()
    return error === undefined
  }
}
