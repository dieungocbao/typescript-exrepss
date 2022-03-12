import UserService from '../users/user.service'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import TokenData from '../interfaces/tokenData.interface'
import { AUTHORIZATION, JWT_SECRET } from '../constants'
import IUser from '../users/user.interface'
import DataStoredInToken from '../interfaces/dataStored.interface'
import UserAlreadyExistExeption from '../exceptions/userAlreadyExist.exception'
import CreateUserDto from '../users/dto/user.dto'
import LoginDto from './dto/login.dto'
import WrongCredentialsExeption from '../exceptions/wrongCredentials.exception'

class AuthService {
  private readonly userService = new UserService()

  public async register(userData: CreateUserDto) {
    console.log('register')
    const userExist = await this.userService.findOneUser(userData.email)
    console.log(userExist)
    if (userExist) {
      throw new UserAlreadyExistExeption(userData.email)
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const newUser = await this.userService.createUser({
      ...userData,
      password: hashedPassword
    })
    newUser.password = ''
    return {
      user: userData
    }
  }

  public async login(loginData: LoginDto) {
    const user = await this.userService.findOneUser(loginData.email)
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        loginData.password,
        user.password
      )
      if (isPasswordMatching) {
        user.password = ''
        const tokenData = this.createToken(user)
        const cookie = this.createCookie(tokenData)
        return {
          cookie,
          user
        }
      } else {
        throw new WrongCredentialsExeption()
      }
    } else {
      throw new WrongCredentialsExeption()
    }
  }

  public createToken = (user: IUser): TokenData => {
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
public createCookie(tokenData: TokenData) {
    return `${AUTHORIZATION}=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/`
  }
}

export default AuthService
