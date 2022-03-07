import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import CreateAddressDto from "./address.dto";

class CreateUserDto {
  @IsString()
  public name: string

  @IsEmail()
  public email: string

  @IsNotEmpty()
  @MinLength(6)
  public password: string

  public address: CreateAddressDto
}

export default CreateUserDto