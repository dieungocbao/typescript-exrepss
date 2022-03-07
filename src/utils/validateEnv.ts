import { cleanEnv, str } from 'envalid'

function validateEnv() {
  cleanEnv(process.env, {
    PORT: str(),
    MONGO_URI: str(),
    JWT_SECRET: str()
  })
}

export default validateEnv
