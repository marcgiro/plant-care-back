import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserDto } from "./dtos/user.dto";
import { UsersService } from "./users.service";

@Controller("auth")
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post("/signup")
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.name, body.email, body.password);
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
