import { DataSource } from "typeorm";
import AppDataSource from "../data-source";
import request from "supertest";
import app from "../app";
import { createTableValid } from "./mocks/tables.mock";

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
    const response = await request(app).post(baseUrl).send(createTableValid);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        seats: 4,
        isActive: false,
        table_number: 7,
      })
    );
  });
});
