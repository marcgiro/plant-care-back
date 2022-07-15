import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(name: string, email: string, password: string) {
    const isEmail = await this.usersService.findOneByEmail(email);
    if (isEmail) {
      console.log("holiiii");
      console.log(isEmail);
      throw new BadRequestException("Email already in use");
    }
    return this.usersService.create(name, email, password);
  }

  signIn(email: string, password: string) {}
}
