import './config/module-alias'
import { env } from '@/main/config/env'

(async (): Promise<void> => {
  const { app } = await import('@/main/config/app')
  app.listen(env.port)
})()
  .then(() => console.log(`Server runing at http://localhost:${env.port}`))
  .catch(console.error)
