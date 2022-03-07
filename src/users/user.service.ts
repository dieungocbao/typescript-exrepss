import IPost from '../posts/post.interface'
import CreateUserDto from './dto/user.dto'
import IUser from './user.interface'
import userModel from './user.model'

class UserService {
  private readonly userModel = userModel
  findOneUser = async (email: string): Promise<IUser | null> => {
    return this.userModel.findOne({ email })
  }

  createUser = async (input: CreateUserDto): Promise<IUser> => {
    const newUser = new this.userModel(input)
    return newUser.save()
  }
}

export default UserService