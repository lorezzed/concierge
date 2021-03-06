import { RequestHandler } from 'express'
import * as get from './db'

export const one: RequestHandler = async (req, res) => {
  const application = await get.one(req.params.id)
  application.key = ''
  res.json(application)
}

export const all: RequestHandler = async (req, res) => {
  const applications = await get.all()

  for (const app of applications) {
    app.key = ''
  }

  res.json(applications)
}