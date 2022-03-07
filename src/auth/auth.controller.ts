import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserAlreadyExistExeption from '../exceptions/userAlreadyExist.exception'
import Controller from '../interfaces/controller.interface'
import CreateUserDto from '../users/dto/user.dto'
import UserService from '../users/user.service'
import LoginDto from './dto/login.dto'
import WrongCredentialsExeption from '../exceptions/wrongCredentials.exception'
import validationMiddleware from '../middlewares/validation.middleware'
import IUser from '../users/user.interface'
import TokenData from '../interfaces/tokenData.interface'
import DataStoredInToken from '../interfaces/dataStored.interface'
import { AUTHORIZATION, JWT_SECRET } from '../constants'

class AuthController implements Controller {
  public path = '/auth'
  public router = express.Router()
  private readonly userSerice = new UserService()
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
    const userData: CreateUserDto = req.body
    const userExist = await this.userSerice.findOneUser(userData.email)
    if (userExist) {
      next(new UserAlreadyExistExeption(userData.email))
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const newUser = await this.userSerice.createUser({
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
    const user = await this.userSerice.findOneUser(loginData.email)
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        loginData.password,
        user.password
      )
      if (isPasswordMatching) {
        user.password = ''
        const tokenData = this.createToken(user)
        res.setHeader('Set-Cookie', [this.createCookie(tokenData)])
        res.send(user)
      } else {
        next(new WrongCredentialsExeption())
      }
    } else {
      next(new WrongCredentialsExeption())
    }
  }

  private loggingOut = (_req: express.Request, res: express.Response) => {
    res.setHeader('Set-Cookie', [`${AUTHORIZATION}=; Max-age=0; Path=/`])
    res.sendStatus(200)
  }

  private createToken = (user: IUser): TokenData => {
    const expiresIn = 60 * 60 // 1 hour
    const secret = JWT_SECRET
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id
    }
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    }
  }

  private createCookie(tokenData: TokenData) {
    return `${AUTHORIZATION}=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/`
  }
}

export default AuthController
