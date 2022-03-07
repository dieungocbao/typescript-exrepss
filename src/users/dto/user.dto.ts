import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

class CreateUserDto {
  @IsString()
  public name: string

  @IsEmail()
  public email: string

  @IsNotEmpty()
  @MinLength(6)
  public password: string
}

export default CreateUserDto