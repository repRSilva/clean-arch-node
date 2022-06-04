import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { SaveUserPicture } from '@/domain/contracts/repos'
import { mock, MockProxy } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let userProfileRepo: MockProxy<SaveUserPicture>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto = mock()
    userProfileRepo = mock()
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo)
  })

  test('Should call UploadFile with correct input', async () => {
    crypto.uuid.mockReturnValue(uuid)
    await sut({ id: 'any_id', file })
    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  test('Should not call UploadFile when file is undefined', async () => {
    crypto.uuid.mockReturnValue(uuid)
    await sut({ id: 'any_id', file: undefined })
    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  test('Should call SaveUserPicture with corret input', async () => {
    await sut({ id: 'any_id', file })
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })
})
