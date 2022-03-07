import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import express from 'express'
import HttpException from '../exceptions/httpExceptions'

function validationMiddleware(
  type: ClassConstructor<any>,
  skipMissingProperties = false
): express.RequestHandler {
  return (req, _res, next) => {
    validate(plainToInstance(type, req.body), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) =>
              Object.values(error.constraints as any)
            )
            .join(', ')
          next(new HttpException(400, message))
        } else {
          next()
        }
      }
    )
  }
}

export default validationMiddleware
