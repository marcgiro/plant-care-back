import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth/auth.service";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController", () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    const users: User[] = [];
    mockUsersService = {
      findOneByEmail: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
    };
    mockAuthService = {
      signUp(name: string, email: string, password: string) {
        const user = {
          id: Math.floor(Math.random() * 99999),
          name,
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
      signIn(email: string, password: string) {
        const filteredUser = users
          .filter((user) => user.email === email)
          .filter((user) => user.password === password);
        if (filteredUser.length === 1) return Promise.resolve(filteredUser[0]);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("the createUser method should create and return a user and place the user id into the session object", async () => {
    const session = { userId: null };
    const requestBody = {
      name: "firstUser",
      email: "firstUser@gmail.com",
      password: "password",
    };

    const user = await controller.createUser(requestBody, session);

    expect(user).toBeDefined();
    expect(user.id).toEqual(session.userId);
  });

  it("the signIn method should return the user and place the user id into de session object", async () => {
    const session = { userId: null };
    const requestBodySignUp = {
      name: "firstUser",
      email: "firstUser@gmail.com",
      password: "password",
    };
    const requestBodySignIn = {
      email: "firstUser@gmail.com",
      password: "password",
    };

    await controller.createUser(requestBodySignUp, session);
    const signedInUser = await controller.signIn(requestBodySignIn, session);

    expect(signedInUser).toBeDefined();
    expect(signedInUser.id).toEqual(session.userId);
  });

  it("the signOut method should set session userId to null and return 'You are signed out' ", () => {
    const session = { userId: 1 };

    const response = controller.signOut(session);

    expect(response).toEqual("You are signed out");
    expect(session.userId).toBeNull();
  });

  it("the signOut method should return 'You are not signed in' when the user tries to sign out when is not signed in", () => {
    const session = { userId: null };

    const response = controller.signOut(session);

    expect(response).toEqual("You are not signed in");
  });
});
