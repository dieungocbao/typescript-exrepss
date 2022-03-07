import express from 'express'
import bcrypt from 'bcrypt'
import UserAlreadyExistExeption from '../exceptions/userAlreadyExist.exception'
import Controller from '../interfaces/controller.interface'
import CreateUserDto from '../users/dto/user.dto'
import UsersService from '../users/users.service'
import LoginDto from './dto/login.dto'
import WrongCredentialsExeption from '../exceptions/wrongCredentials.exception'
import validationMiddleware from '../middlewares/validation.middleware'

class AuthController implements Controller {
  public path = '/auth'
  public router = express.Router()
  private readonly usersSerice = new UsersService()
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
  }

  private register = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDto = req.body
    const userExist = await this.usersSerice.findOneUser(userData.email)
    if (userExist) {
      next(new UserAlreadyExistExeption(userData.email))
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const newUser = await this.usersSerice.createUser({
        ...userData,
        password: hashedPassword
      })
      newUser.password = ''
      res.send(newUser)
    }
  }

  private login = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const loginData: LoginDto = req.body
    const user = await this.usersSerice.findOneUser(loginData.email)
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        loginData.password,
        user.password
      )
      if (isPasswordMatching) {
        user.password = ''
        res.send(user)
      } else {
        next(new WrongCredentialsExeption())
      }
    } else {
      next(new WrongCredentialsExeption())
    }
  }
}

export default AuthController
