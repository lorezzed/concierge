import { RequestHandler } from 'express'
import validate from './validate'
import * as db from '../../data'

const handler: RequestHandler = async (req, res) => {
  const { repository, name, key } = req.body

  const id = req.params.id
  const body = { repository, name, key }
  const errors = validate(body)

  if (errors.length) {
    res.status(400).json(errors)
    return
  }

  try {
    const result: number[] = await db.applications()
      .update(body)
      .where('id', id)
    res.json({ id, ...body })
  } catch (ex) {
    res.status(500)
    res.json({ message: ex.message || ex })
  }
}


export default handler