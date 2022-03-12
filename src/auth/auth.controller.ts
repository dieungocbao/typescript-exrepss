import express from 'express'
import Controller from '../interfaces/controller.interface'
import CreateUserDto from '../users/dto/user.dto'
import LoginDto from './dto/login.dto'
import validationMiddleware from '../middlewares/validation.middleware'
import { AUTHORIZATION } from '../constants'
import AuthService from './auth.service'

class AuthController implements Controller {
  public path = '/auth'
  public router = express.Router()
  private readonly authService = new AuthService()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.register
    )
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LoginDto),
      this.login
    )
    this.router.post(`${this.path}/logout`, this.loggingOut)
  }

  private register = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userData: CreateUserDto = req.body
      const { user } = await this.authService.register(userData)
      res.send(user)
    } catch (error) {
      next(error)
    }
  }

  private login = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const loginData: LoginDto = req.body
      const { user, cookie } = await this.authService.login(loginData)
      res.setHeader('Set-Cookie', cookie)
      res.send(user)
    } catch (error) {
      next(error)
    }
  }

  private loggingOut = (_req: express.Request, res: express.Response) => {
    res.setHeader('Set-Cookie', [`${AUTHORIZATION}=; Max-age=0; Path=/`])
    res.sendStatus(200)
  }
}

export default AuthController
