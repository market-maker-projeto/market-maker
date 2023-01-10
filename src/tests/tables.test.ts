import { DataSource } from "typeorm";
import AppDataSource from "../data-source";
import request from "supertest";
import app from "../app";
import { createTableValid } from "./mocks/tables.mock";
import { createAdminValid } from "./mocks/users.mock";

describe("POSt/tables", () => {
  let connection: DataSource;
  const baseUrl = "/tables";

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

  test("POST /tables - Must be able to register a table", async () => {
    const adminLoginResponse = await request(app)
      .post(baseUrl)
      .send(createAdminValid);

    const response = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(createTableValid);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        seats: 4,
        isActive: false,
        table_number: 7,
      })
    );
  });

  test("POST /tables - Should not be able to create a table that already exists", async () => {
    const adminLoginResponse = await request(app)
      .post(baseUrl)
      .send(createAdminValid);

    const response = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(createTableValid);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(409);
  });

  test("POST /tables - Should not be able to create table not being admin", async () => {
    const response = await request(app).post(baseUrl).send(createTableValid);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("POST /tables - Should not be able to create table without authentication", async () => {
    const response = await request(app).post(baseUrl).send(createTableValid);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });
});
