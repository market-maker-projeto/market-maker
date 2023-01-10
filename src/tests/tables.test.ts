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
      .post("/login")
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
      .post("/login")
      .send(mockedAdmin);

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveLength(1);
    expect(response.status).toBe(200);
  });

  test("GET /tables/:id - It should be possible to list a specific table", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdmin);

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveLength(1);
    expect(response.status).toBe(200);
  });

  test("GET /tables - Should not be able to list table not being admin", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdmin);

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("PATCH /tables/:id -  should not be able to update user without authentication",async () => {
    const adminLoginResponse = await request(app).post("/login").send(mockedAdmin);
    const userTobeUpdate = await request(app).get(baseUrl).set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
    const response = await request(app).patch(`/tables/${userTobeUpdate.body[0].id}`)

    expect(response.body).toHaveProperty("message")
    expect(response.status).toBe(401)
         
})

  test("DELETE /tables/:id -  Must be able to soft delete table", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdmin);

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

  test("DELETE /tables/:id -  should not be able to delete user without authentication", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdmin);

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
    const UserTobeDeleted = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);

    const response = await request(app)
      .delete(`/tables/${UserTobeDeleted.body[0].id}`)
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("DELETE /tables/:id -  should not be able to delete table with invalid id",async () => {
    await request(app).post('/login').send(mockedAdmin)

    const adminLoginResponse = await request(app).post("/login").send(mockedAdminLogin);
    
    const response = await request(app).delete(`/tables/13970660-5dbe-423a-9a9d-5c23b37943cf`).set("Authorization", `Bearer ${adminLoginResponse.body.token}`)
    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty("message")
 
})
});
