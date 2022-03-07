import HttpException from "./httpExceptions";

class WrongCredentialsExeption extends HttpException {
  constructor() {
    super(401, 'Wrong credentials')
  }
}

export default WrongCredentialsExeption