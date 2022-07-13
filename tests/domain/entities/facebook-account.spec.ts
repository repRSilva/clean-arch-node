import { FacebookAccount } from '@/domain/entities'

describe('FacebookAccount', () => {
  const facebookData = { name: 'any_fb_name', email: 'any_fb_email', facebookId: 'any_fb_id' }
  test('Should create with facebook data only', async () => {
    const sut = new FacebookAccount(facebookData)
    expect(sut).toEqual(facebookData)
  })

  test('Should update name if is empty', async () => {
    const accountData = { id: 'any_id' }
    const sut = new FacebookAccount(facebookData, accountData)
    expect(sut).toEqual({ id: 'any_id', name: 'any_fb_name', email: 'any_fb_email', facebookId: 'any_fb_id' })
  })

  test('Should not update name if its not empty', async () => {
    const accountData = { id: 'any_id', name: 'any_name' }
    const sut = new FacebookAccount(facebookData, accountData)
    expect(sut).toEqual({ id: 'any_id', name: 'any_name', email: 'any_fb_email', facebookId: 'any_fb_id' })
  })
})
