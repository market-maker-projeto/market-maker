import request from "supertest";
import { DataSource } from "typeorm";
import app from "../app";
import AppDataSource from "../data-source";
import { createUserValid } from "./mocks/users.mock";

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
    await request(app).post("/users").send(createUserValid);
    const admLoginResp = await request(app)
      .post("/login")
      .send(createUserValid);
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${admLoginResp.body.token}`);

    expect(response.body).toHaveLength(2);
    expect(response.body[0]).not.toHaveProperty("password");
  });
});
