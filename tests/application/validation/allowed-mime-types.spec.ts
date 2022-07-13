import { InvalidMimeTypeError } from '@/application/errors'
import { AllowedMimeTypes } from '@/application/validation'

describe('AllowedMimeTypes', () => {
  test('Should return InvalidMimeTypeError if value is invalid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/jpg')
    const error = sut.validate()
    expect(error).toEqual(new InvalidMimeTypeError(['png']))
  })

  test('Should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/png')
    const error = sut.validate()
    expect(error).toBeUndefined()
  })

  test('Should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpg')
    const error = sut.validate()
    expect(error).toBeUndefined()
  })

  test('Should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpeg')
    const error = sut.validate()
    expect(error).toBeUndefined()
  })
})
