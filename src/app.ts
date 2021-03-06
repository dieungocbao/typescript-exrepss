import express, { IRouter } from 'express'
import bodyParser from 'body-parser'
import errorMiddleware from './middlewares/error.middleware'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

interface AppController {
  router: IRouter
}

class App {
  public app: express.Application
  public port: number | string

  constructor(controllers: Array<AppController>, port: number | string) {
    this.app = express()
    this.port = port

    this.connectDatabse()
    this.initializeMiddlewares()
    this.initializeControllers(controllers)
    this.initializeErrorHandling()
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json())
    this.app.use(cookieParser())
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  private initializeControllers(controllers: Array<AppController>) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router)
    })
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`)
    })
  }

  private connectDatabse() {
    const URI = process.env.MONGO_URI

    mongoose.connect(`${URI}`, {}, (err) => {
      if (err) throw err
      console.log('MongoDB connected...')
    })
  }
}

export default App
