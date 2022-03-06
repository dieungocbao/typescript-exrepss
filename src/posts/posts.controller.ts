import express, { Request, Response } from 'express'
import Controller from '../interfaces/controller.interface'
import PostsService from './posts.service'

class PostsController implements Controller {
  public path = '/posts'
  public router = express.Router()
  private readonly postsService = new PostsService()
  constructor() {
    this.initializeRoutes()
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts)
    this.router.get(`${this.path}/:id`, this.getPostById)
    this.router.post(this.path, this.createPost)
    this.router.patch(`${this.path}/:id`, this.updatePost)
    this.router.delete(`${this.path}/:id`, this.deletePost)
  }

  private getAllPosts = async (_req: Request, res: Response) => {
    const posts = await this.postsService.getAllPosts()
    return res.send(posts)
  }

  private getPostById = async (req: Request, res: Response) => {
    const { id } = req.params
    const post = await this.postsService.getPostById(id)
    return res.send(post)
  }

  private createPost = async (req: Request, res: Response) => {
    const input = req.body
    const post = await this.postsService.createPost(input)
    return res.send(post)
  }

  private updatePost = async (req: Request, res: Response) => {
    const { id } = req.params
    const input = req.body
    const post = await this.postsService.updatePost(id, input)
    return res.send(post)
  }

  private deletePost = async (req: Request, res: Response) => {
    const { id } = req.params
    const post = await this.postsService.deletePost(id)
    return res.send(post)
  }
}

export default PostsController
