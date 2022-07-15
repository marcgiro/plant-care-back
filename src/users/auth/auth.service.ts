import { BadRequestException, Injectable } from "@nestjs/common";
import { scrypt as _scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { UsersService } from "../users.service";

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(name: string, email: string, password: string) {
    const isEmail = await this.usersService.findOneByEmail(email);
    if (isEmail) {
      throw new BadRequestException("Email already in use");
    }

    const salt = randomBytes(8).toString("hex");
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = salt + "." + hash.toString("hex");

    return this.usersService.create(name, email, hashedPassword);
  }

  signIn(email: string, password: string) {}
}
