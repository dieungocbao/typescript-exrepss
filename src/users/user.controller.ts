import express from 'express'
import NotAuthorizedException from '../exceptions/notAuthorize.exception'
import Controller from '../interfaces/controller.interface'
import RequestWithUser from '../interfaces/requestWithUser.interface'
import authMiddleware from '../middlewares/auth.middleware'
import PostService from '../posts/post.service'

class UserController implements Controller {
  public path = '/users'
  public router = express.Router()
  private readonly postService = new PostService()
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/:id/posts`,
      authMiddleware,
      this.getAllPostsOfUser
    )
  }

  private getAllPostsOfUser = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userId = req.params.id
    if (userId === req.user?._id?.toString()) {
      const posts = await this.postService.getAllPostsByUser(userId)
      res.send(posts)
    } else {
      next(new NotAuthorizedException())
    }
  }
}

export default UserController
