import CreatePostInput from './dto/createPost.dto'
import IPost from './post.interface'
import postModel from './post.model'

class PostService {
  private readonly postModel = postModel

  getAllPosts = async (): Promise<Array<IPost>> => {
    return this.postModel.find().populate('author', '-password')
  }

  getPostById = async (id: string): Promise<IPost | null | undefined> => {
    return this.postModel.findById(id).populate('author', '-password')
  }

  getAllPostsByUser = async (id: string): Promise<Array<IPost>> => {
    return this.postModel.find({ author: id })
  }

  createPost = async (input: CreatePostInput): Promise<IPost> => {
    const createdPost = new this.postModel(input)
    const savedPost = await createdPost.save()
    await savedPost.populate('author', '-password')
    return savedPost
  }

  updatePost = async (
    id: string,
    input: CreatePostInput
  ): Promise<IPost | null> => {
    return this.postModel.findByIdAndUpdate(id, input, { new: true })
  }

  deletePost = async (id: string): Promise<IPost | null> => {
    return this.postModel.findByIdAndDelete(id)
  }
}

export default PostService
