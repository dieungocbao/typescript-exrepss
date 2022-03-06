import CreatePostInput from './dto/createPost.dto'
import UpdatePostInput from './dto/updatePost.dto'
import IPost from './post.interface'
import postModel from './posts.model'

class PostsService {
  private readonly postModel = postModel

  getAllPosts = async (): Promise<Array<IPost>> => {
    return this.postModel.find()
  }

  getPostById = async (id: string): Promise<IPost | null | undefined> => {
    return this.postModel.findById(id)
  }

  createPost = async (input: CreatePostInput): Promise<IPost> => {
    const createdPost = new this.postModel(input)
    return createdPost.save()
  }

  updatePost = async (
    id: string,
    input: UpdatePostInput
  ): Promise<IPost | null> => {
    return this.postModel.findByIdAndUpdate(id, input, { new: true })
  }

  deletePost = async (id: string): Promise<IPost | null> => {
    return this.postModel.findByIdAndDelete(id)
  }
}

export default PostsService
