import express, { NextFunction, Request, Response } from 'express'
import PostNotFoundException from '../exceptions/postNotFound.exeption'
import Controller from '../interfaces/controller.interface'
import RequestWithUser from '../interfaces/requestWithUser.interface'
import authMiddleware from '../middlewares/auth.middleware'
import validationMiddleware from '../middlewares/validation.middleware'
import CreatePostDto from './dto/createPost.dto'
import PostsService from './posts.service'

class PostsController implements Controller {
  public path = '/posts'
  public router = express.Router()
  private readonly postsService = new PostsService()
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts)
    this.router.get(`${this.path}/:id`, this.getPostById)
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreatePostDto, true),
        this.updatePost
      )
      .delete(`${this.path}/:id`, this.deletePost)
      .post(
        this.path,
        authMiddleware,
        validationMiddleware(CreatePostDto),
        this.createPost
      )
  }

  private getAllPosts = async (_req: Request, res: Response) => {
    const posts = await this.postsService.getAllPosts()
    return res.send(posts)
  }

  private getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params
    const post = await this.postsService.getPostById(id)
    if (post) {
      return res.send(post)
    } else {
      next(new PostNotFoundException(id))
    }
  }

  private createPost = async (req: RequestWithUser, res: Response) => {
    const input: CreatePostDto = { ...req.body, author: req.user }
    const post = await this.postsService.createPost(input)
    return res.send(post)
  }

  private updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params
    const input = req.body
    const post = await this.postsService.updatePost(id, input)
    if (post) {
      return res.send(post)
    } else {
      next(new PostNotFoundException(id))
    }
  }

  private deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params
    const post = await this.postsService.deletePost(id)
    if (post) {
      return res.send(post)
    } else {
      next(new PostNotFoundException(id))
    }
  }
}

export default PostsController
