import HttpException from "./httpExceptions";

class UserAlreadyExistExeption extends HttpException {
  constructor(email: string) {
    super(400, `User with email ${email} already exist`)
  }
}

export default UserAlreadyExistExeption