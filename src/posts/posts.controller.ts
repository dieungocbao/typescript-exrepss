import express, { Request, Response } from 'express'
import IPost from './post.interface'

class PostsController {
  public path = '/posts'
  public router = express.Router()
  private posts: Array<IPost> = [
    {
      author: 'Marcin',
      content: 'Dolor sit amet',
      title: 'Lorem Ipsum'
    }
  ]

  constructor() {
    this.initializeRoutes()
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts)
    this.router.post(this.path, this.createPost)
  }

  private getAllPosts = (_req: Request, res: Response) => {
    res.send(this.posts)
  }

  private createPost = (req: Request, res: Response) => {
    const post: IPost = req.body
    this.posts.push(post)
    res.send(this.posts)
  }
}

export default PostsController
