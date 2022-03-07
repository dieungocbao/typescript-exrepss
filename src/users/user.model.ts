import mongoose from 'mongoose'
import { uuid as v4 } from 'uuidv4'
import IUser from './user.interface'

type UserSchemaType = IUser & mongoose.Document

const addressSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4
  },
  street: String,
  city: String,
  country: String
})

const userSchema = new mongoose.Schema<UserSchemaType>({
  _id: {
    type: String,
    default: v4
  },
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  address: addressSchema
})

const userModel = mongoose.model<UserSchemaType>('User', userSchema)

export default userModel
