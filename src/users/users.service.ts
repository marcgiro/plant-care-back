import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async create(name: string, email: string, password: string) {
    const user = this.repository.create({
      name,
      email,
      password,
    });
    return this.repository.save(user);
  }

  findOneById(id: number) {
    return this.repository.findOneBy({ id });
  }

  find() {
    return this.repository.find();
  }

  async update(id: number, attributes: Partial<User>) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new Error("User not found");
    }
    Object.assign(user, attributes);
    return this.repository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return this.repository.remove(user);
  }
}
