import { RequiredFieldError, MaxFileSizeError, InvalidMimeTypeError } from '@/application/errors'
import { SavePictureController, Controller } from '@/application/controllers'

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

  test('Should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: undefined as any, userId })
    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('file') })
  })

  test('Should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: null as any, userId })
    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('file') })
  })

  test('Should return 400 if file is empty', async () => {
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from(''), mimeType }, userId })
    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('file') })
  })

  test('Should return 400 if file type is invalid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'invalid_type' }, userId })
    expect(httpResponse).toEqual({ statusCode: 400, data: new InvalidMimeTypeError(['png', 'jpeg']) })
  })

  test('Should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/png' }, userId })
    expect(httpResponse).not.toEqual({ statusCode: 400, data: new InvalidMimeTypeError(['png', 'jpeg']) })
  })

  test('Should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpg' }, userId })
    expect(httpResponse).not.toEqual({ statusCode: 400, data: new InvalidMimeTypeError(['png', 'jpeg']) })
  })

  test('Should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpeg' }, userId })
    expect(httpResponse).not.toEqual({ statusCode: 400, data: new InvalidMimeTypeError(['png', 'jpeg']) })
  })

  test('Should return 400 if file size is bigger than 5mb', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
    const httpResponse = await sut.handle({ file: { buffer: invalidBuffer, mimeType }, userId })
    expect(httpResponse).toEqual({ statusCode: 400, data: new MaxFileSizeError(5) })
  })

  test('Should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({ file, userId })
    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId, file: buffer })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })

  test('Should return 200 with valid data', async () => {
    const httpResponse = await sut.handle({ file, userId })
    expect(httpResponse).toEqual({ statusCode: 200, data: { initials: 'any_initials', pictureUrl: 'any_url' } })
  })
})
