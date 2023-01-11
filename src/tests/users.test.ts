import request from "supertest";
import { DataSource } from "typeorm";
import app from "../app";
import AppDataSource from "../data-source";
import { User } from "../entities/user.entity";
import {
  createUserValid,
  mockedAdmin,
  mockedAdminLogin,
  mockedUserLogin,
} from "./mocks/users.mock";

describe("POST/users", () => {
  let connection: DataSource;
  const baseUrl = "/users";
  const userRepo = AppDataSource.getRepository(User);

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  beforeEach(async () => {
    const users = await userRepo.find();
    await userRepo.remove(users);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /user - Must be able to create a user", async () => {
    const response = await request(app).post(baseUrl).send(createUserValid);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: "uuid",
        isAdmin: false,
        username: "user",
      })
    );
    expect(response.body).not.toHaveProperty("password");
  });

  test("POST /users - Should not to be able to create a user that already exists", async () => {
    const userReq = userRepo.create(createUserValid);
    await userRepo.save(userReq);

    const response = await request(app).post("/users").send(createUserValid);

    const [user, amount] = await userRepo.findAndCountBy({
      id: response.body.id,
    });
    expect(amount).toBe(1);
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(409);
  });

  test("POST /users - Should not be possible to create a user without administrator permissions", async () => {
    const userLoginAdmin = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${userLoginAdmin.body.token}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toEqual(
      expect.objectContaining({
        id: "uuid",
        isAdmin: false,
        username: "user",
      })
    );
  });

  test("GET /users - Must be able to list users", async () => {
    await request(app).post("/users").send(mockedAdmin);
    const userLoginAdmin = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${userLoginAdmin.body.token}`);

    expect(response.body).toHaveProperty("map");
    expect(response.body[0]).not.toHaveProperty("password");
  });

  test("GET /users - It should be possible to list a especific user", async () => {
    const userLoginAdmin = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${userLoginAdmin.body.token}`);

    const userReq = userRepo.create(createUserValid);
    await userRepo.save(userReq);

    const userExists = await userRepo.find({
      where: {
        id: response.body.id,
      },
    });

    expect(userExists).toHaveLength(1);
    expect(response.body).toHaveProperty("map");
    expect(response.status).toBe(200);
  });

  test("GET /users - Should not be able to list users without authentication", async () => {
    const response = await request(app).get("/users");

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("GET /users - Should not be able to list users not being admin", async () => {
    const userLoginResp = await request(app)
      .post("/login")
      .send(mockedUserLogin);
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${userLoginResp.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("DELETE /users/:id - Should not be possible to delete a user without admin permission", async () => {
    const adminLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const userToBeDeleted = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResp.body.token}`);

    const response = await request(app).delete(
      `/users/${userToBeDeleted.body[0].id}`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });
});
