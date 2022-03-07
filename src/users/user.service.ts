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

  countUsersByCountry = async () => {
    const result = this.userModel.aggregate([
      {
        $match: {
          'address.country': {
            $exists: true
          }
        }
      },
      {
        $group: {
          _id: {
            country: '$address.country'
          },
          users: {
            $push: {
              _id: '$_id',
              name: '$name'
            }
          },
          count: {
            $sum: 1
          }
        }
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'users._id',
          foreignField: 'author',
          as: 'articles'
        }
      },
      {
        $addFields: {
          amountOfArticles: {
            $size: '$articles'
          }
        }
      },
      {
        $sort: {
          amountOfArticles: 1
        }
      }
    ])
    return result
  }
}

export default UserService
