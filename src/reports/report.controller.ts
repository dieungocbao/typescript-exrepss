import express from 'express'
import Controller from '../interfaces/controller.interface'
import UserService from '../users/user.service'

class ReportController implements Controller {
  public path = '/report'
  public router = express.Router()
  private userService = new UserService()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.generateReport)
  }

  private generateReport = async (
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    const usersByCountries = await this.userService.countUsersByCountry()
    res.send({
      usersByCountries
    })
  }
}

export default ReportController
