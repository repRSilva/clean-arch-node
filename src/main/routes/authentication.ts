import { Router } from 'express'

export default (router: Router): void => {
  router.post('/authentication', (req, res, next) => res.send({ user: req.body }))
}
