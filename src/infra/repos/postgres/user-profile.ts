import { SaveUserPicture } from '@/domain/contracts/repos'
import { PgUser } from '@/infra/repos/postgres/entities'
import { getRepository } from 'typeorm'

type Input = SaveUserPicture.Input

export class PgUserProfileRepository implements SaveUserPicture {
  async savePicture({ id, pictureUrl, initials }: Input): Promise<void> {
    const pgUserRepo = getRepository(PgUser)
    await pgUserRepo.update({ id: parseInt(id) }, { pictureUrl, initials })
  }
}
