import {
  mockedAdmin,
  mockedAdminLogin,
  mockedUser,
  mockedUserLogin,
} from "./mocks/users.mock";
import request from "supertest";
import { DataSource } from "typeorm";
import AppDataSource from "../data-source";
import app from "../app";

describe("/login", () => {
  let connection: DataSource;
  const baseUrl = "/login";

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    await request(app).post("/users").send(mockedAdmin);
    await request(app).post("/users").send(mockedUser);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /login -  Should be able to login with the user", async () => {
    const response = await request(app).post(baseUrl).send(mockedUserLogin);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("POST /login -  Should be able to login with the user admin", async () => {
    const response = await request(app).post(baseUrl).send(mockedAdminLogin);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("POST /login -  Should not be able to login with the user with incorrect password or username", async () => {
    const response = await request(app).post(baseUrl).send({
      email: "user",
      password: "1234567",
    });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });
});
