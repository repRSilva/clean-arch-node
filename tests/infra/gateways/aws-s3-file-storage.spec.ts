import { AwsS3FileStorage } from '@/infra/gateways'
import { config, S3 } from 'aws-sdk'
import { mocked } from 'jest-mock'

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  let sut: AwsS3FileStorage
  let accessKey: string
  let secret: string
  let bucket: string
  let fileName: string

  beforeAll(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
    bucket = 'any_bucket'
    fileName = 'any_file_name'
  })

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKey, secret, bucket)
  })

  test('Should config aws credentials on creation', () => {
    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledWith({ credentials: { accessKeyId: accessKey, secretAccessKey: secret } })
  })

  describe('upload', () => {
    let file: Buffer
    let putObjectSpy: jest.Mock
    let putObjectPromiseSpy: jest.Mock

    beforeAll(() => {
      file = Buffer.from('any_buffer')
      putObjectPromiseSpy = jest.fn()
      putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({
        putObject: putObjectSpy
      })))
    })
    test('Should call putObject with correc input', async () => {
      await sut.upload({ fileName, file })
      expect(putObjectSpy).toHaveBeenCalledWith({ Bucket: bucket, Key: fileName, Body: file, ACL: 'public-read' })
      expect(putObjectSpy).toHaveBeenCalledTimes(1)
      expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
    })

    test('Should return imageUrl', async () => {
      const imageUrl = await sut.upload({ fileName, file })
      expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/${fileName}`)
    })

    test('Should return encoded imageUrl', async () => {
      const imageUrl = await sut.upload({ fileName: 'any file name', file })
      expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20file%20name`)
    })

    test('Should rethrow if putObject', async () => {
      const error = new Error('upload_error')
      putObjectPromiseSpy.mockRejectedValueOnce(error)
      const promise = sut.upload({ fileName, file })
      await expect(promise).rejects.toThrow(error)
    })
  })

  describe('delete', () => {
    let deleteObjectSpy: jest.Mock
    let deleteObjectPromiseSpy: jest.Mock
    beforeAll(() => {
      deleteObjectPromiseSpy = jest.fn()
      deleteObjectSpy = jest.fn().mockImplementation(() => ({ promise: deleteObjectPromiseSpy }))
      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({
        deleteObject: deleteObjectSpy
      })))
    })

    test('Should call deleteObject with correct input', async () => {
      await sut.delete({ fileName })
      expect(deleteObjectSpy).toHaveBeenCalledWith({ Bucket: bucket, Key: fileName })
      expect(deleteObjectSpy).toHaveBeenCalledTimes(1)
      expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1)
    })

    test('Should rethrow if deleteObject', async () => {
      const error = new Error('upload_error')
      deleteObjectPromiseSpy.mockRejectedValueOnce(error)
      const promise = sut.delete({ fileName })
      await expect(promise).rejects.toThrow(error)
    })
  })
})
