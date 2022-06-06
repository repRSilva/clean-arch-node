import { UserProfile } from '@/domain/entities'

describe('UserProfile', () => {
  let sut: UserProfile

  beforeEach(() => {
    sut = new UserProfile('any_id')
  })

  test('Should create with empty initials when pictureUrl is provided', async () => {
    sut.setupPicture({ pictureUrl: 'any_url', name: 'any_name' })
    expect(sut).toEqual({ id: 'any_id', pictureUrl: 'any_url', initials: undefined })
  })

  test('Should create with empty initials when pictureUrl is provided', async () => {
    sut.setupPicture({ pictureUrl: 'any_url' })
    expect(sut).toEqual({ id: 'any_id', pictureUrl: 'any_url', initials: undefined })
  })

  test('Should create initials with first letter of first and last names', async () => {
    sut.setupPicture({ name: 'any_name any_rename' })
    expect(sut).toEqual({ id: 'any_id', pictureUrl: undefined, initials: 'AA' })
  })

  test('Should create initials with first two letters of first and last names', async () => {
    sut.setupPicture({ name: 'any_name' })
    expect(sut).toEqual({ id: 'any_id', pictureUrl: undefined, initials: 'AN' })
  })

  test('Should create initials with first letter', async () => {
    sut.setupPicture({ name: 'a' })
    expect(sut).toEqual({ id: 'any_id', pictureUrl: undefined, initials: 'A' })
  })

  test('Should create with empty initials when name and pictureUrl are not provided', async () => {
    sut.setupPicture({})
    expect(sut).toEqual({ id: 'any_id', pictureUrl: undefined, initials: undefined })
  })
})
