import mongoose from 'mongoose'
import { uuid as v4 } from 'uuidv4'
import IPost from './post.interface'

type PostSchemaType = IPost & mongoose.Document

const postSchema = new mongoose.Schema<PostSchemaType>({
  _id: {
    type: String,
    default: v4
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  author: {
    type: String
  }
})

const postModel = mongoose.model<PostSchemaType>('Post', postSchema)

export default postModel
