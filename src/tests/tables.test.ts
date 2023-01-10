import { DataSource } from "typeorm";
import AppDataSource from "../data-source";
import request from "supertest";
import app from "../app";
import { createTableValid } from "./mocks/tables.mock";
import { mockedAdmin, mockedAdminLogin } from "./mocks/users.mock";

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
      .post("/login")
      .send(mockedAdminLogin);

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveLength(1);
    expect(response.status).toBe(200);
  });

  test("GET /tables/:id - It should be possible to list a specific table", async () => {
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
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("PATCH /tables/:id -  Should not be able to update table without authentication", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const tableTobeUpdate = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);
    const response = await request(app).patch(
      `/tables/${tableTobeUpdate.body[0].id}`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /tables/:id - Should not be able to update table with invalid id", async () => {
    const newValues = { seats: 2, table_number: 9 };

    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdmin);
    const token = `Bearer ${admingLoginResponse.body.token}`;

    const tableTobeUpdateRequest = await request(app)
      .get(baseUrl)
      .set("Authorization", token);
    // const tableTobeUpdateId = tableTobeUpdateRequest.body[0].id;

    const response = await request(app)
      .patch(`${baseUrl}/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", token)
      .send(newValues);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("PATCH /tables/:id - Should not be able to update isAdm field value", async () => {
    const newValues = { isAdm: false };

    const admingLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdmin);
    const token = `Bearer ${admingLoginResponse.body.token}`;

    const tableTobeUpdateRequest = await request(app)
      .get("/tables")
      .set("Authorization", token);
    const tableTobeUpdateId = tableTobeUpdateRequest.body[0].id;

    const response = await request(app)
      .patch(`${baseUrl}/${tableTobeUpdateId}`)
      .set("Authorization", token)
      .send(newValues);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /tables/:id -  Should be able to update table",async () => {
    const newValues = {seats: 5, table_number: 5}

    const admingLoginResponse = await request(app).post("/login").send(mockedAdmin);
    const token = `Bearer ${admingLoginResponse.body.token}`
    
    const tableTobeUpdateRequest = await request(app).get("/tables").set("Authorization", token)
    const tableTobeUpdateId = tableTobeUpdateRequest.body[0].id

    const response = await request(app).patch(`/tables/${tableTobeUpdateId}`).set("Authorization",token).send(newValues)

    const tableUpdated = await request(app).get("/tables").set("Authorization", token)

    expect(response.status).toBe(200)
    expect(tableUpdated.body[0].seats).toEqual(5)
    expect(tableUpdated.body[0].table_number).toEqual(5)
})    

  test("DELETE /tables/:id -  Must be able to soft delete table", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const tableTobeDeleted = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app).delete(
      `/tables/${tableTobeDeleted.body[0].id}`
    );

    const findTable = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(findTable.body[0].isActive).toBe(false);
    expect(response.status).toBe(401);
  });

  test("DELETE /tables/:id -  should not be able to delete table without authentication", async () => {
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
    const userLoginResponse = await request(app)
      .post("/login")
      .send(createTableValid);
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
    await request(app).post("/login").send(mockedAdmin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const response = await request(app)
      .delete(`${baseUrl}/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
