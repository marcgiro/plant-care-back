import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth/auth.service";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController", () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    let users: User[] = [];
    mockUsersService = {
      async findOneById(id) {
        const filteredUser = users.filter((user) => user.id === id);
        return filteredUser[0];
      },

      async find() {
        return users;
      },

      async remove(id) {
        const user = this.findOneById(id);
        users = users.filter((user) => user.id !== id);
        return user;
      },

      async update(id, body) {
        const user = await this.findOneById(id).then((foundUser: User) => {
          return foundUser;
        });

        user.name = body.name;
        console.log(user);
        return await user;
      },
    };
    mockAuthService = {
      async signUp(name: string, email: string, password: string) {
        const user = {
          id: Math.floor(Math.random() * 99999),
          name,
          email,
          password,
        } as User;
        users.push(user);
        return user;
      },

      async signIn(email: string, password: string) {
        const filteredUser = users
          .filter((user) => user.email === email)
          .filter((user) => user.password === password);
        if (filteredUser.length === 1) return filteredUser[0];
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

  it("the whoAmI method should return the user signed in", () => {
    const user = { id: 1, name: "firstUser", email: "firstUser@gmail.com" };
    const whoAmIUser = controller.whoAmI(user as User);

    expect(whoAmIUser).toEqual(user);
  });

  it("the findOneUser should return the user corresponding with the id given as a parameter", async () => {
    const user = {
      name: "firstUser",
      email: "firstUser@gmail.com",
      password: "password",
    } as User;
    const session = { userId: null };
    const createdUser = await controller.createUser(user, session);
    const foundUser = await controller.findOneUser(session.userId);

    expect(foundUser).toEqual(createdUser);
  });

  it("the findAllUsers should return an array with all the users", async () => {
    const users = [
      {
        name: "firstUser",
        email: "firstUser@gmail.com",
        password: "password",
      },
      {
        name: "secondUser",
        email: "secondUser@gmail.com",
        password: "password",
      },
    ] as User[];
    const session1 = { userId: null };
    const session2 = { userId: null };

    const createdUser1 = await controller.createUser(users[0], session1);
    const createdUser2 = await controller.createUser(users[1], session2);
    const foundUsers = await controller.findAllUsers();

    expect(foundUsers).toEqual([createdUser1, createdUser2]);
  });

  it("the deleteUser method should remove the user specified and return it", async () => {
    const user = {
      name: "firstUser",
      email: "firstUser@gmail.com",
      password: "password",
    } as User;
    const session = { userId: null };
    const createdUser = await controller.createUser(user, session);

    const removedUser = await controller.deleteUser(session.userId);
    const users = await controller.findAllUsers();

    expect(createdUser).toEqual(removedUser);
    expect(users).toEqual([]);
  });

  it("the updateUser method should update the user specified with the information of the body in the request", async () => {
    const user = {
      name: "firstUser",
      email: "firstUser@gmail.com",
      password: "password",
    } as User;
    const session = { userId: null };
    await controller.createUser(user, session);

    const requestBody = { name: "firstUserUpdatedName" } as UpdateUserDto;
    const updatedUser = await controller.updateUser(
      session.userId,
      requestBody,
    );

    expect(updatedUser.name).toEqual(requestBody.name);
  });
});
