import { RequiredString, ValidationBuilder, RequiredBuffer, Required, MaxFileSize, AllowedMimeTypes } from '@/application/validation'

describe('ValidationBuilder', () => {
  test('Should return RequiredString', () => {
    const validators = ValidationBuilder.of({ value: 'any_value', fieldName: 'any_name' }).required().build()
    expect(validators).toEqual([new RequiredString('any_value', 'any_name')])
  })

  test('Should return RequiredBuffer', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder.of({ value: buffer, fieldName: 'any_name' }).required().build()
    expect(validators).toEqual([new RequiredBuffer(buffer, 'any_name')])
  })

  test('Should return Required', () => {
    const validators = ValidationBuilder.of({ value: { any: 'any' }, fieldName: 'any_name' }).required().build()
    expect(validators).toEqual([new Required({ any: 'any' }, 'any_name')])
  })

  test('Should return Required', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder.of({ value: { buffer }, fieldName: 'any_name' }).required().build()
    expect(validators).toEqual([new Required({ buffer }, 'any_name'), new RequiredBuffer(buffer, 'any_name')])
  })

  test('Should return correct Image validators', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder.of({ value: { buffer }, fieldName: 'any_name' }).image({ allowed: ['png'], maxSizeInMb: 6 }).build()
    expect(validators).toEqual([new MaxFileSize(6, buffer)])
  })

  test('Should return correct Image validators', () => {
    const validators = ValidationBuilder.of({ value: { mimeType: 'image/png' }, fieldName: 'any_name' }).image({ allowed: ['png'], maxSizeInMb: 6 }).build()
    expect(validators).toEqual([new AllowedMimeTypes(['png'], 'image/png')])
  })

  test('Should return correct Image validators', () => {
    const buffer = Buffer.from('any_buffer')
    const validators = ValidationBuilder.of({ value: { buffer, mimeType: 'image/png' }, fieldName: 'any_name' }).image({ allowed: ['png'], maxSizeInMb: 6 }).build()
    expect(validators).toEqual([new AllowedMimeTypes(['png'], 'image/png'), new MaxFileSize(6, buffer)])
  })
})
