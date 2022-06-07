import { AwsS3FileStorage } from '@/infra/gateways'
import { config, S3 } from 'aws-sdk'
import { mocked } from 'jest-mock'

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  let sut: AwsS3FileStorage
  let accessKey: string
  let secret: string
  let bucket: string
  let key: string
  let file: Buffer
  let putObjectSpy: jest.Mock
  let putObjectPromiseSpy: jest.Mock

  beforeAll(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
    bucket = 'any_bucket'
    key = 'any_key'
    file = Buffer.from('any_buffer')
    putObjectPromiseSpy = jest.fn()
    putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
    mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({
      putObject: putObjectSpy
    })))
  })

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKey, secret, bucket)
  })

  test('Should config aws credentials on creation', () => {
    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledWith({ credentials: { accessKeyId: accessKey, secretAccessKey: secret } })
  })

  test('Should call putObject with correc input', async () => {
    await sut.upload({ key, file })
    expect(putObjectSpy).toHaveBeenCalledWith({ Bucket: bucket, Key: key, Body: file, ACL: 'public-read' })
    expect(putObjectSpy).toHaveBeenCalledTimes(1)
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
  })

  test('Should return imageUrl', async () => {
    const imageUrl = await sut.upload({ key, file })
    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/${key}`)
  })

  test('Should return encoded imageUrl', async () => {
    const imageUrl = await sut.upload({ key: 'any key', file })
    expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20key`)
  })

  test('Should rethrow if putObject', async () => {
    const error = new Error('upload_error')
    putObjectPromiseSpy.mockRejectedValueOnce(error)
    const promise = sut.upload({ key, file })
    await expect(promise).rejects.toThrow(error)
  })
})
