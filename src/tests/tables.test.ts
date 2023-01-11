import { DataSource } from "typeorm";
import AppDataSource from "../data-source";
import request from "supertest";
import app from "../app";
import { createTableValid } from "./mocks/tables.mock";
import {
  mockedAdmin,
  createUserValid,
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
    await request(app).post("/users").send(mockedAdmin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

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
    await request(app).post("/users").send(mockedAdmin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const response = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
      .send(createTableValid);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(409);
  });

  test("POST /tables - Should not be able to create table not being admin", async () => {
    await request(app).post("/users").send(createUserValid);

    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const response = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`)
      .send(createTableValid);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("POST /tables - Should not be able to create table without authentication", async () => {
    const response = await request(app).get(baseUrl).send(createTableValid);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("POST /tables - It must not be possible to register an invalid table", async () => {
    await request(app).post("/users").send(mockedAdmin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

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

  test("GET /tables - Must be able to list all tables", async () => {
    await request(app).post("/users").send(mockedAdmin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("map");
    expect(response.status).toBe(200);
  });

  test("GET /tables/:id - It should be possible to list a specific table", async () => {
    await request(app).post("/users").send(mockedAdmin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveLength(1);
    expect(response.status).toBe(200);
  });

  test("GET /tables - Should not be able to list table not being admin", async () => {
    await request(app).post("/users").send(createUserValid);

    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("PATCH /tables/:id - should not be able to update tables without adm permission", async () => {
    await request(app).post("/users").send(mockedAdmin);
    await request(app).post("/users").send(createUserValid);

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
    await request(app).post("/users").send(mockedAdmin);

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
    expect(userUpdated.body[0].seats).toBe(10);
    expect(userUpdated.body[0].isActive).toBe(true);
  });

  test("PATCH /tables/:id - should not be able to update table with invalid id", async () => {
    await request(app).post("/users").send(mockedAdmin);

    const newValues = { seats: 10 };

    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const token = `Bearer ${admingLoginResponse.body.token}`;

    const response = await request(app)
      .patch(`/tables/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", token)
      .send(newValues);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("PATCH /tables/:id - should not be able to update another table without adm permission", async () => {
    await request(app).post("/users").send(createUserValid);

    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const userToken = `Bearer ${userLoginResponse.body.token}`;

    const tableTobeUpdateRequest = await request(app)
      .get(baseUrl)
      .set("Authorization", userToken);
    const tableTobeUpdateId = tableTobeUpdateRequest.body[1].id;

    const response = await request(app)
      .patch(`${baseUrl}/${tableTobeUpdateId}`)
      .set("Authorization", userToken);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("DELETE /tables/:id -  Must be able to delete table", async () => {
    await request(app).post("/users").send(mockedAdmin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const tableTobeDeleted = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .delete(`/tables/${tableTobeDeleted.body[0].id}`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.status).toBe(204);
  });

  test("DELETE /tables/:id -  should not be able to delete table without authentication", async () => {
    await request(app).post("/users").send(mockedAdmin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const tableTobeDeleted = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app).delete(
      `/tables/${tableTobeDeleted.body[0].id}`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("DELETE /tables/:id -  should not be able to delete table not being admin", async () => {
    await request(app).post("/users").send(mockedAdmin);
    await request(app).post("/users").send(createUserValid);

    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const tableTobeDeleted = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .delete(`/tables/${tableTobeDeleted.body[0].id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("DELETE /tables/:id -  should not be able to delete table with invalid id", async () => {
    await request(app).post("/users").send(mockedAdmin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const response = await request(app)
      .delete(`/tables/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
