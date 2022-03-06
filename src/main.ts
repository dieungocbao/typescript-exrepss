import dotenv from 'dotenv'
dotenv.config()
import validateEnv from './utils/validateEnv'
import App from './app'
import PostsController from './posts/posts.controller'

validateEnv()

const port = process.env.PORT || 5000

const app = new App([new PostsController()], port)

// database connection
import './configs/database'

app.listen()
