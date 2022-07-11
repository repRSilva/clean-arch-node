import { SavePictureController, Controller } from '@/application/controllers'
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer } from '@/application/validation'

describe('SavePictureController', () => {
  let sut: SavePictureController
  let buffer: Buffer
  let mimeType: string
  let file: { buffer: Buffer, mimeType: string }
  let userId: string
  let changeProfilePicture: jest.Mock

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = { buffer, mimeType }
    userId = 'any_user_id'
    changeProfilePicture = jest.fn().mockResolvedValue({ initials: 'any_initials', pictureUrl: 'any_url' })
  })

  beforeEach(() => {
    sut = new SavePictureController(changeProfilePicture)
  })

  test('Should extend controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  test('Should build validators correctly on save', async () => {
    const validators = sut.buildValidators({ file, userId })
    expect(validators).toEqual([
      new Required(file, 'file'),
      new RequiredBuffer(buffer, 'file'),
      new AllowedMimeTypes(['png', 'jpg'], mimeType),
      new MaxFileSize(5, buffer)
    ])
  })

  test('Should build validators correctly on delete', async () => {
    const validators = sut.buildValidators({ file: undefined, userId })
    expect(validators).toEqual([])
  })

  test('Should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({ file, userId })
    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId, file })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })

  test('Should return 200 with valid data', async () => {
    const httpResponse = await sut.handle({ file, userId })
    expect(httpResponse).toEqual({ statusCode: 200, data: { initials: 'any_initials', pictureUrl: 'any_url' } })
  })
})
