import './config/module-alias'
import 'reflect-metadata'
import { env } from '@/main/config/env'
import { config } from '@/infra/postgres/helpers'
import { app } from '@/main/config/app'
import { createConnection } from 'typeorm'

createConnection(config)
  .then(() => app.listen(env.port, () => console.log(`Server runing at http://localhost:${env.port}`)))
  .catch(console.error)
