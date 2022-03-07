import dotenv from 'dotenv'
dotenv.config()
import validateEnv from './utils/validateEnv'
import App from './app'
import PostController from './posts/post.controller'
import AuthController from './auth/auth.controller'
import UserController from './users/user.controller'
import ReportController from './reports/report.controller'

validateEnv()

const port = process.env.PORT || 5000

const app = new App(
  [
    new AuthController(),
    new PostController(),
    new UserController(),
    new ReportController()
  ],
  port
)

app.listen()
