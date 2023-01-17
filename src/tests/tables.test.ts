import { DataSource } from "typeorm";
import AppDataSource from "../data-source";
import request from "supertest";
import app from "../app";
import { mockedTable } from "./mocks/tables.mock";
import {
  mockedAdmin,
  mockedUser,
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
    await request(app).post("/users").send(mockedAdmin);
    await request(app).post("/users").send(mockedUser);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /tables - Must be able to register a table", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResponse.body.token}`;

    const response = await request(app)
      .post(baseUrl)
      .set("Authorization", token)
      .send(mockedTable);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("seats");
    expect(response.body).toHaveProperty("isActive");
    expect(response.body).toHaveProperty("table_number");
  });

  test("POST /tables - Should not be able to register a table that already exists", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResponse.body.token}`;

    const response = await request(app)
      .post(baseUrl)
      .set("Authorization", token)
      .send(mockedTable);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
  });

  test("POST /tables - Should not be able to create table not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const token = `Bearer ${userLoginResponse.body.token}`;

    const response = await request(app)
      .post(baseUrl)
      .set("Authorization", token)
      .send(mockedTable);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("POST /tables - Should not be able to create table without authentication", async () => {
    const response = await request(app).post(baseUrl).send(mockedTable);



    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("POST /tables - Should not be possible to register an invalid table", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResponse.body.token}`;

    const response = await request(app)
      .post(baseUrl)
      .set("Authorization", token)
      .send({
        seats: 4,
        isActive: false,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("GET /tables - Must be able to list all tables", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResponse.body.token}`;

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("map");
  });

  test("GET /tables/:id - Must be possible to list a specific table", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResponse.body.token}`;

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toHaveProperty("map");
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("seats");
    expect(response.body[0]).toHaveProperty("isActive");
    expect(response.body[0]).toHaveProperty("table_number");
  });

 
 

  test("PATCH /tables/:id -  Should be able to update table", async () => {
    const newValues = { seats: 10, isActive: true, table_number: 20 };

    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${admingLoginResponse.body.token}`;

    const tableTobeUpdateRequest = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    const tableTobeUpdateId = tableTobeUpdateRequest.body[0].id;

    const response = await request(app)
      .patch(`${baseUrl}/${tableTobeUpdateId}`)
      .set("Authorization", token)
      .send(newValues);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("seats");
    expect(response.body).toHaveProperty("isActive");
    expect(response.body).toHaveProperty("table_number");
  });

  test("PATCH /tables/:id - Should not be able to update table with invalid id", async () => {
    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${admingLoginResponse.body.token}`;

    const response = await request(app)
      .patch(`${baseUrl}/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", token)
      .send({
        seats: 15,
        isActive: true,
        table_number: 21,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("DELETE /tables/:id -  Must be able to delete table", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResponse.body.token}`;

    const tableTobeDeleted = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    const tableToDeletedId = tableTobeDeleted.body[0].id;

    const response = await request(app)
      .delete(`${baseUrl}/${tableToDeletedId}`)
      .set("Authorization", token);

    expect(response.status).toBe(204);
  });

  test("DELETE /tables/:id -  Should not be able to delete table not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const userToken = `Bearer ${userLoginResponse.body.token}`;
    const adminToken = `Bearer ${adminLoginResponse.body.token}`;

    const createTable = await request(app)
      .post(baseUrl)
      .set("Authorization", adminToken)
      .send(mockedTable);

    const tableTobeDeleted = await request(app)
      .get(baseUrl)
      .set("Authorization", adminToken);

    const response = await request(app)
      .delete(`${baseUrl}/${tableTobeDeleted.body[0].id}`)
      .set("Authorization", userToken);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("DELETE /tables/:id -  Should not be able to delete table with invalid id", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResponse.body.token}`;

    const response = await request(app)
      .delete(`${baseUrl}/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", token);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
