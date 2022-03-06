import express from 'express'
const app = express()

function loggerMiddleware(
  request: express.Request,
  _response: express.Response,
  next: express.NextFunction
) {
  console.log(`
  ${request.method} ${request.path}`)
  next()
}

app.use(loggerMiddleware)

app.get('/', function (_req, res) {
  res.send('Hello World')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
