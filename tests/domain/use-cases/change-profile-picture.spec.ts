import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { SaveUserPicture, LoadUserProfile } from '@/domain/contracts/repos'
import { mock, MockProxy } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto = mock()
    crypto.uuid.mockReturnValue(uuid)
    userProfileRepo = mock()
    userProfileRepo.load.mockResolvedValue({ name: 'any_name any_rename' })
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo)
  })

  test('Should call UploadFile with correct input', async () => {
    await sut({ id: 'any_id', file })
    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  test('Should not call UploadFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })
    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  test('Should call SaveUserPicture with corret input', async () => {
    await sut({ id: 'any_id', file })
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url', initials: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  test('Should call SaveUserPicture with corret input when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'AA' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  test('Should call SaveUserPicture with corret input when file is undefined', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: 'any_name any_rename' })
    await sut({ id: 'any_id', file: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'AA' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  test('Should call SaveUserPicture with corret input when file is undefined', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: 'any_name' })
    await sut({ id: 'any_id', file: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'AN' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  test('Should call SaveUserPicture with corret input when file is undefined', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: 'a' })
    await sut({ id: 'any_id', file: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: 'A' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  test('Should call SaveUserPicture with corret input when file is undefined and name is undefined', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: undefined })
    await sut({ id: 'any_id', file: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined, initials: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  test('Should call LoadUserProfile with correct input', async () => {
    await sut({ id: 'any_id', file: undefined })
    expect(userProfileRepo.load).toHaveBeenCalledWith({ id: 'any_id' })
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1)
  })

  test('Should not call LoadUserProfile if file exists', async () => {
    await sut({ id: 'any_id', file })
    expect(userProfileRepo.load).not.toHaveBeenCalled()
  })
})
