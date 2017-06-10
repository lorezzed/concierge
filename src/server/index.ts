import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as path from 'path'
import api from './api'
import errorHandler from './error-handler'

const app = express()
const router = express.Router()

/**
 * TODO
 * Authentication
 * Signed cookies
 */

app.use(compression())
app.use(bodyParser.json())

router.use('/api', api)

const staticPath = path.resolve(__dirname, '..', '..', 'front')
app.use(express.static(staticPath))

// 404 handler
app.use('/', (_, res) => {
  res.status(404)
  res.sendFile(path.resolve(staticPath, 'index.html'))
  return
})

app.use(errorHandler)

export default app