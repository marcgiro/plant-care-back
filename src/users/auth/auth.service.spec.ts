import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users.service";
import { User } from "../user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

let service: AuthService;
let mockUsersService: Partial<UsersService>;

beforeEach(async () => {
  const users: User[] = [];
  mockUsersService = {
    findOneByEmail: (email: string) => {
      const filteredUser = users.filter((user) => user.email === email);
      return Promise.resolve(filteredUser[0]);
    },
    create: (name: string, email: string, password: string) => {
      const user = {
        id: Math.floor(Math.random() * 99999),
        name,
        email,
        password,
      } as User;
      users.push(user);
      return Promise.resolve(user);
    },
  };

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      AuthService,
      { provide: UsersService, useValue: mockUsersService },
    ],
  }).compile();

  service = module.get<AuthService>(AuthService);
});

describe("AuthService", () => {
  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("creates a new user with a salted and hashed password", async () => {
    const password = "correctPassword";
    const user = await service.signUp(
      "firstUser",
      "firstUser@gmail.com",
      password,
    );
    const [salt, hash] = user.password.split(".");

    expect(user.password).not.toEqual(password);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it("throws an error if the user signs up with an email already in use", async () => {
    await service.signUp("firstUser", "firstUser@gmail.com", "password");

    try {
      await service.signUp("secondUser", "firstUser@gmail.com", "password");
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual("Email already in use");
    }
  });

  it("throws a NotFoundException if the user signs in with an email that does not exist", async () => {
    try {
      await service.signIn("firstUser@gmail.com", "password");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual("User not found");
    }
  });
});

it("throws a BadRequestException if an invalid password is provided", async () => {
  await service.signUp("firstUser", "firstUser@gmail.com", "correctPassword");

  try {
    await service.signIn("firstUser@gmail.com", "wrongPassword");
  } catch (error) {
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.message).toEqual("Invalid password");
  }
});

it("returns the user if the password is correct", async () => {
  await service.signUp("firstUser", "firstUser@gmail.com", "password");

  const user = await service.signIn("firstUser@gmail.com", "password");

  expect(user).toBeDefined();
});
