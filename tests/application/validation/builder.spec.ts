import { RequiredString, ValidationBuilder } from '@/application/validation'

describe('ValidationBuilder', () => {
  test('Should return a RequiredString', () => {
    const validators = ValidationBuilder.of({ value: 'any_value', fieldName: 'any_name' }).required().build()
    expect(validators).toEqual([new RequiredString('any_value', 'any_name')])
  })
})
