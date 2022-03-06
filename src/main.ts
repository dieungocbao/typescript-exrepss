import dotenv from 'dotenv'
dotenv.config()
import App from './app'
import PostsController from './posts/posts.controller'

const port = process.env.PORT || 5000

const app = new App([new PostsController()], port)

app.listen()
