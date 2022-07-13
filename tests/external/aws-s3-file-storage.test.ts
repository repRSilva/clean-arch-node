import { AwsS3FileStorage } from '@/infra/gateways'
import { env } from '@/main/config/env'
import axios from 'axios'

describe('Aws S3 Integration Tests', () => {
  let sut: AwsS3FileStorage

  beforeEach(() => {
    sut = new AwsS3FileStorage(env.s3.accessKey, env.s3.secret, env.s3.bucket)
  })

  test('Should return upload and delete image from aws s3', async () => {
    const onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjeOSn/R8ABcwCW5knHVYAAAAASUVORK5CYII='
    const file = Buffer.from(onePixelImage, 'base64')
    const fileName = 'any_file_name.png'
    const pictureUrl = await sut.upload({ fileName, file })
    expect((await axios.get(pictureUrl)).status).toBe(200)
    await sut.delete({ fileName })
    await expect(axios.get(pictureUrl)).rejects.toThrow()
  })
})
