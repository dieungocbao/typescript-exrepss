import { cleanEnv, str } from 'envalid'

function validateEnv() {
  cleanEnv(process.env, {
    PORT: str(),
    MONGO_URI: str()
  })
}

export default validateEnv
