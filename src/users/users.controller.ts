import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guards";
import { Serialize } from "../interceptors/serialize.interceptor";
import { AuthService } from "./auth/auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { CreateUserDto } from "./dtos/create-user.dto";
import { SignInUserDto } from "./dtos/signIn-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserDto } from "./dtos/user.dto";
import { UsersService } from "./users.service";

@Controller("auth")
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post("/signup")
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(
      body.name,
      body.email,
      body.password,
    );
    session.userId = user.id;
    return user;
  }

  @Post("/signin")
  async signIn(@Body() body: SignInUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post("/signout")
  @UseGuards(AuthGuard)
  signOut(@Session() session: any) {
    if (session.userId) {
      session.userId = null;
      return "You are signed out";
    }
    return "You are not signed in";
  }

  @Get("/whoami")
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: UserDto) {
    return user;
  }

  @Get("/:id")
  findOneUser(@Param("id") id: string) {
    return this.usersService.findOneById(parseInt(id));
  }

  @Get("/")
  findAllUsers() {
    return this.usersService.find();
  }

  @Delete("/:id")
  deleteUser(@Param("id") id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch("/:id")
  updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
