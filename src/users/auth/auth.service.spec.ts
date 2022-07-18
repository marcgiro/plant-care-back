import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users.service";
import { User } from "../user.entity";
import { BadRequestException } from "@nestjs/common";

let service: AuthService;
let mockUsersService: Partial<UsersService>;

beforeEach(async () => {
  mockUsersService = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    findOneByEmail: (email: string) => Promise.resolve(undefined as User),
    create: (name: string, email: string, password: string) =>
      Promise.resolve({
        id: 1,
        name,
        email,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User),
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
    const password = "kaldjsf4678";
    const user = await service.signUp("firstUser", "eli5@gmail.com", password);
    const [salt, hash] = user.password.split(".");

    expect(user.password).not.toEqual(password);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it("throws an error if the user signs up with an email already in use", (done) => {
    mockUsersService.findOneByEmail = (email: string) =>
      Promise.resolve({ id: 1, name: "firstUser", email } as User);
    const password = "kaldjsf4678";

    service
      .signUp("firstUser", "eli23@gmail.com", password)
      .then()
      .catch(() => {
        //done();
      });
  });
});
