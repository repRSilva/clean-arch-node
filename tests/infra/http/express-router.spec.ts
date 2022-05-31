import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock, MockProxy } from 'jest-mock-extended'
import { Controller } from '@/application/controllers'

class ExpressRouter {
  constructor(private readonly controller: Controller) { }
  async adapt(req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...req.body })
    res.status(200).json(httpResponse.data)
  }
}

describe('ExpressRouter', () => {
  let req: Request
  let res: Response
  let controller: MockProxy<Controller>
  let sut: ExpressRouter

  beforeEach(() => {
    req = getMockReq({ body: { any: 'any' } })
    res = getMockRes().res
    controller = mock()
    controller.handle.mockResolvedValue({ statusCode: 200, data: { data: 'any_data' } })
    sut = new ExpressRouter(controller)
  })

  test('Should call handle with correct request', async () => {
    await sut.adapt(req, res)
    expect(controller.handle).toHaveBeenCalledTimes(1)
    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
  })

  test('Should call handle with empty request', async () => {
    const req = getMockReq()
    await sut.adapt(req, res)
    expect(controller.handle).toHaveBeenCalledTimes(1)
    expect(controller.handle).toHaveBeenCalledWith({})
  })

  test('Should respond with 200 and valid data', async () => {
    await sut.adapt(req, res)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ data: 'any_data' })
  })
})
