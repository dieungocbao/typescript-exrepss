import express, { IRouter } from 'express'
import bodyParser from 'body-parser'
import errorMiddleware from './middlewares/error.middleware'

interface AppController {
  router: IRouter
}

class App {
  public app: express.Application
  public port: number | string

  constructor(controllers: Array<AppController>, port: number | string) {
    this.app = express()
    this.port = port

    this.initializeMiddlewares()
    this.initializeControllers(controllers)
    this.initializeErrorHandling()
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json())
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
}

export default App
