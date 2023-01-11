import { DataSource } from "typeorm";
import AppDataSource from "../data-source";
import request from "supertest";
import app from "../app";
import { createTableValid } from "./mocks/tables.mock";
import {
  mockedAdmin,
  mockedAdminLogin,
  mockedUserLogin,
} from "./mocks/users.mock";

describe("POST /tables", () => {
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
      .send(mockedAdmin);

    const response = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(createTableValid);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("seats");
    expect(response.body).toHaveProperty("isActive");
    expect(response.body).toHaveProperty("table_number");
  });

  test("POST /tables - Should not be able to create a table that already exists", async () => {
    const adminLoginResponse = await request(app)
      .post(baseUrl)
      .send(mockedAdmin);

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

  test("POST /tables - It must not be possible to register an invalid table", async () => {
    const response = await request(app).post(baseUrl).send(createTableValid);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("GET /tables - Must be able to list all tables", async () => {
    const adminLoginResponse = await request(app)
      .post(baseUrl)
      .send(mockedAdmin);

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveLength(1);
    expect(response.status).toBe(200);
  });

  test("GET /tables/:id - It should be possible to list a specific table", async () => {
    const adminLoginResponse = await request(app)
      .post(baseUrl)
      .send(mockedAdmin);

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveLength(1);
    expect(response.status).toBe(200);
  });

  test("GET /tables - Should not be able to list table not being admin", async () => {
    const adminLoginResponse = await request(app)
      .post(baseUrl)
      .send(mockedAdmin);

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("PATCH /tables/:id - should not be able to update tables without adm permission", async () => {
    const newValues = { seats: 10 };

    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);
    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const userToken = `Bearer ${userLoginResponse.body.token}`;
    const adminToken = `Bearer ${admingLoginResponse.body.token}`;

    const tableTobeUpdateRequest = await request(app)
      .get(baseUrl)
      .set("Authorization", adminToken);
    const tableTobeUpdateId = tableTobeUpdateRequest.body[1].id;

    const response = await request(app)
      .patch(`/tables/${tableTobeUpdateId}`)
      .set("Authorization", userToken)
      .send(newValues);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /tables/:id -  should be able to update table", async () => {
    const newValues = { seats: 10, isActive: true };

    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const token = `Bearer ${admingLoginResponse.body.token}`;

    const tableTobeUpdateRequest = await request(app)
      .get(baseUrl)
      .set("Authorization", token);
    const tableTobeUpdateId = tableTobeUpdateRequest.body[0].id;

    const response = await request(app)
      .patch(`/tables/${tableTobeUpdateId}`)
      .set("Authorization", token)
      .send(newValues);

    const userUpdated = await request(app)
      .get("/tables")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(userUpdated.body[0].seats).toEqual(10);
    expect(userUpdated.body[0].isActive).toEqual(true);
  });

  test("PATCH /tables/:id - should not be able to update table with invalid id", async () => {
    const newValues = { seats: 10 };

    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const token = `Bearer ${admingLoginResponse.body.token}`;

    const tableTobeUpdateRequest = await request(app)
      .get("/users")
      .set("Authorization", token);
    const tableTobeUpdateId = tableTobeUpdateRequest.body[0].id;

    const response = await request(app)
      .patch(`/users/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", token)
      .send(newValues);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });
});
