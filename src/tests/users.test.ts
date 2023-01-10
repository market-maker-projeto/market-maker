import request from "supertest";
import { DataSource } from "typeorm";
import app from "../app";
import AppDataSource from "../data-source";
import {
  createUserValid,
  mockedAdmin,
  mockedAdminLogin,
  mockedUserLogin,
} from "./mocks/users.mock";

describe("POST/users", () => {
  let connection: DataSource;
  const baseUrl = "/users";

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /user - Must be able to create a user", async () => {
    const response = await request(app).post(baseUrl).send(createUserValid);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        isAdmin: false,
        username: "testename",
      })
    );
    expect(response.body).not.toHaveProperty("password");
  });

  test("POST /users - should not to be able to create a user that already exists", async () => {
    const response = await request(app).post("/users").send(createUserValid);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(409);
  });

  test("GET /users - Must be able to list users", async () => {
    await request(app).post("/users").send(mockedAdmin);
    const admLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${admLoginResp.body.token}`);

    expect(response.body).toHaveLength(2);
    expect(response.body[0]).not.toHaveProperty("password");
  });

  test("GET /users - should not be able to list users without authentication", async () => {
    const response = await request(app).get("/users");

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("GET /users - should not be able to list users not being admin", async () => {
    const userLoginResp = await request(app)
      .post("/login")
      .send(mockedUserLogin);
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${userLoginResp.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("DELETE /users/:id - should not be able to delete user without authentication", async () => {
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
