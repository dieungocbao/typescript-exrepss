import IPost from "../posts/post.interface"

interface IUser {
  _id: string
  name: string
  email: string
  password: string
  address: string
}

export default IUser