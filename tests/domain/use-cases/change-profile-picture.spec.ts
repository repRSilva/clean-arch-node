import { UploadFile, DeleteFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { SaveUserPicture, LoadUserProfile } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'
import { mock, MockProxy } from 'jest-mock-extended'
import { mocked } from 'jest-mock'

jest.mock('@/domain/entities/user-profile')

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile & DeleteFile>
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
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(mocked(UserProfile).mock.instances[0])
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  test('Should call SaveUserPicture with corret input', async () => {
    userProfileRepo.load.mockResolvedValue(undefined)
    await sut({ id: 'any_id', file })
    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(mocked(UserProfile).mock.instances[0])
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

  test('Should return correct data on success', async () => {
    mocked(UserProfile).mockImplementationOnce(id => ({ setPicture: jest.fn(), id: 'any_id', pictureUrl: 'any_url', initials: 'any_initials' }))
    const result = await sut({ id: 'any_id', file })
    expect(result).toMatchObject({ pictureUrl: 'any_url', initials: 'any_initials' })
  })

  test('Should call DeleteFile when file exists and SaveUserPicture throws', async () => {
    expect.assertions(2)
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error())
    const promise = sut({ id: 'any_id', file })
    promise.catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledWith({ key: uuid })
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
    })
  })

  test('Should not call DeleteFile when file does not exists and SaveUserPicture throws', async () => {
    expect.assertions(1)
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error())
    const promise = sut({ id: 'any_id', file: undefined })
    promise.catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled()
    })
  })

  test('Should rethrows SaveUserPicture throws', async () => {
    const error = new Error('save_error')
    userProfileRepo.savePicture.mockRejectedValueOnce(error)
    const promise = sut({ id: 'any_id', file })
    await expect(promise).rejects.toThrow(error)
  })

  it('should rethrow if UploadFile throws', async () => {
    const error = new Error('upload_error')
    fileStorage.upload.mockRejectedValueOnce(error)
    const promise = sut({ id: 'any_id', file })
    await expect(promise).rejects.toThrow(error)
  })

  it('should rethrow if LoadUserProfile throws', async () => {
    const error = new Error('load_error')
    userProfileRepo.load.mockRejectedValueOnce(error)
    const promise = sut({ id: 'any_id', file: undefined })
    await expect(promise).rejects.toThrow(error)
  })

  it('should rethrow if UUIDGenerator throws', async () => {
    const error = new Error('uuid_error')
    crypto.uuid.mockImplementationOnce(() => { throw error })
    const promise = sut({ id: 'any_id', file })
    await expect(promise).rejects.toThrow(error)
  })
})
