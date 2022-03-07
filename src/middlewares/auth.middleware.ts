import express from 'express'
import jwt from 'jsonwebtoken'
import { AUTHORIZATION, JWT_SECRET } from '../constants'
import AuthenticationTokenMissingException from '../exceptions/authTokenMissing.exception'
import WrongCredentialsExeption from '../exceptions/wrongCredentials.exception'
import DataStoredInToken from '../interfaces/dataStored.interface'
import RequestWithUser from '../interfaces/requestWithUser.interface'
import userModel from '../users/user.model'

async function authMiddleware(
  req: RequestWithUser,
  _res: express.Response,
  next: express.NextFunction
) {
  const cookies = req.cookies
  if (cookies && cookies[AUTHORIZATION]) {
    const secret = JWT_SECRET
    try {
      const verifyResponse = jwt.verify(
        cookies[AUTHORIZATION],
        secret
      ) as DataStoredInToken
      const id = verifyResponse._id
      const user = await userModel.findById(id)
      if (user) {
        req.user = user
        next()
      } else {
        next(new WrongCredentialsExeption())
      }
    } catch (_err) {
      next(new WrongCredentialsExeption())
    }
  } else {
    next(new AuthenticationTokenMissingException())
  }
}

export default authMiddleware
