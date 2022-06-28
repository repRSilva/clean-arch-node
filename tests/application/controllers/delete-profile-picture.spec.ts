import { Controller, DeletePictureController } from '@/application/controllers'

describe('DeleteProfilePicture', () => {
  let changeProfilePicture: jest.Mock
  let sut: DeletePictureController

  beforeAll(() => {
    changeProfilePicture = jest.fn()
  })

  beforeEach(() => {
    sut = new DeletePictureController(changeProfilePicture)
  })

  test('Should extend Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  test('Should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({ userId: 'any_user_id' })
    expect(changeProfilePicture).toHaveBeenCalledWith({ id: 'any_user_id', file: undefined })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })

  test('Should return 204', async () => {
    const httpResponse = await sut.handle({ userId: 'any_user_id' })
    expect(httpResponse).toEqual({ statusCode: 204, data: null })
  })
})
