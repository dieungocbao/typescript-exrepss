interface Address {
  street: string
  city: string
  country: string
}
interface IUser {
  _id: string
  name: string
  email: string
  password: string
  address: Address
}

export default IUser