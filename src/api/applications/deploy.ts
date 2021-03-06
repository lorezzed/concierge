import * as db from './db'
import { RequestHandler } from 'express'
import build from './build'

type Body = {
  ref: string
  tag: string
  type: string
  sha: string
}

const handler: RequestHandler = async (req, res) => {
  const { id } = req.params as { id: number }
  const { ref, tag, type, sha } = req.query as Body
  const app = await db.one(id)

  if (!app) {
    res
      .status(400)
      .json({ message: `Application '${id}' does not exist` })
    return
  }

  try {
    /**
     * This will fail if:
     * - This is no available host
     * - It fails to pack the repo tar ball due to a deployment of that image already taking place
     *
     * It will not await the entire build
     */
    await build(app, sha, tag)
    res.json({ message: `Building image '${tag}'...` })
  } catch (ex) {
    log.error(ex.message || ex)
    if (ex.stack) {
      log.debug(ex.stack)
    }

    res
      .status(500)
      .json({ message: ex.message || ex })
  }
}

export default handler