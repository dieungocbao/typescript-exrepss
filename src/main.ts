import dotenv from 'dotenv'
dotenv.config()
import validateEnv from './utils/validateEnv'
import App from './app'
import PostsController from './posts/posts.controller'
import AuthController from './auth/auth.controller'

validateEnv()

const port = process.env.PORT || 5000

const app = new App([new PostsController(), new AuthController()], port)

app.listen()
