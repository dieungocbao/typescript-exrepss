import mongoose from 'mongoose'

const URI = process.env.MONGO_URI

mongoose.connect(`${URI}`, {}, (err) => {
  if (err) throw err
  console.log('MongoDB connected...')
})
