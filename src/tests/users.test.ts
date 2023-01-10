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
        username: "testename",
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
        username: "testename",
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

  test("DELETE /users/:id -  Must be able to soft delete user", async () => {
    await request(app).post("/users").send(mockedAdmin);

    const adminLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const userTobeDeleted = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResp.body.token}`);

    const response = await request(app)
      .delete(`/users/${userTobeDeleted.body[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResp.body.token}`);
    const findUser = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminLoginResp.body.token}`);
    expect(response.status).toBe(204);
    expect(findUser.body[0].isActive).toBe(false);
  });

  test("DELETE /users/:id -  should not be able to delete user with invalid id", async () => {
    await request(app).post("/users").send(mockedAdmin);

    const adminLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const response = await request(app)
      .delete(`/users/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", `Bearer ${adminLoginResp.body.token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("PATCH /users/:id - should not be able to update user with invalid id", async () => {
    const newValue = { username: "DouglasRJ" };

    const admingLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const token = `Bearer ${admingLoginResp.body.token}`;

    const userTobeUpdateReq = await request(app)
      .get("/users")
      .set("Authorization", token);
    const userTobeUpdateId = userTobeUpdateReq.body[0].id;

    const response = await request(app)
      .patch(`/users/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", token)
      .send(newValue);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("PATCH /users/:id - should not be able to update another user without adm permission", async () => {
    const newValues = { isAdmin: false };

    const userLoginResp = await request(app)
      .post("/login")
      .send(createUserValid);
    const admingLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const userToken = `Bearer ${userLoginResp.body.token}`;
    const adminToken = `Bearer ${admingLoginResp.body.token}`;

    const userTobeUpdateReq = await request(app)
      .get("/users")
      .set("Authorization", adminToken);
    const userTobeUpdateId = userTobeUpdateReq.body[1].id;

    const response = await request(app)
      .patch(`/users/${userTobeUpdateId}`)
      .set("Authorization", userToken)
      .send(newValues);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /users/:id -  should be able to update user", async () => {
    const newValue = { username: "DouglasRJ" };

    const adminLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const token = `Bearer ${adminLoginResp.body.token}`;

    const userTobeUpdateReq = await request(app)
      .get("/users")
      .set("Authorization", token);
    const userTobeUpdateId = userTobeUpdateReq.body[0].id;

    const response = await request(app)
      .patch(`/users/${userTobeUpdateId}`)
      .set("Authorization", token)
      .send(newValue);

    const userUpdated = await request(app)
      .get("/users")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(userUpdated.body[0].username).toEqual("DouglasRJ");
    expect(userUpdated.body[0]).not.toHaveProperty("password");
  });
});
