import {
  mockedUser,
  mockedAdmin,
  mockedAdminLogin,
  mockedUserLogin,
} from "./mocks/users.mock";
import {
  mockedCategory,
  mockedCategoryResponse,
} from "./mocks/categories.mock";
import { DataSource } from "typeorm";
import AppDataSource from "../data-source";
import request from "supertest";
import app from "../app";

describe("POST/category", () => {
  let connection: DataSource;
  const baseUrl = "/categories";

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

  test("POST /category - Must be able to create a category", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResponse.body.token}`;

    const response = await request(app)
      .post(baseUrl)
      .send(mockedCategory)
      .set("Authorization", token);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("id");
  });

  test("POST /category - Should not be able to create a category that already exists", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResponse.body.token}`;

    const response = await request(app)
      .post(baseUrl)
      .send(mockedCategory)
      .set("Authorization", token);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
  });

  test("POST /category - Should not be able to create a category not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const token = `Bearer ${userLoginResponse.body.token}`;

    const response = await request(app)
      .post(baseUrl)
      .set("Authorization", token)
      .send(mockedCategory);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("GET /category - Should be able to list all categories", async () => {
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

  test("PATCH /category/:id- Should be able to edit a category", async () => {
    const newValues = { name: "Alimentação" };

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const token = `Bearer ${adminLoginResponse.body.token}`;

    const categoryToBeUpdatedRequest = await request(app)
      .get(baseUrl)
      .set("Authorization", token);
    const categoryToBeUpdatedId = categoryToBeUpdatedRequest.body[0].id;

    const response = await request(app)
      .patch(`${baseUrl}/${categoryToBeUpdatedId}`)
      .set("Authorization", token)
      .send(newValues);

    const categoryUpdated = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(categoryUpdated.body[0]).toHaveProperty("name");
    expect(categoryUpdated.body[0]).toHaveProperty("id");
  });

  test("PATCH /category/:id - Should not be able to edit a category not being admin", async () => {
    const newValues = { name: "Alimentação" };

    const createAdmin = await request(app).post("/users").send(mockedAdmin);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);
    const adminToken = `Bearer ${adminLoginResponse.body.token}`;
    const userToken = `Bearer ${userLoginResponse.body.token}`;

    const categoryToBeUpdated = await request(app)
      .get(baseUrl)
      .set("Authorization", adminToken);
    const categoryToBeUpdatedId = categoryToBeUpdated.body[0].id;

    const response = await request(app)
      .patch(`${baseUrl}/${categoryToBeUpdatedId}`)
      .set("Authorization", userToken)
      .send(newValues);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("PATCH /category/:id - Should not be able to edit a category that doesnt exists", async () => {
    const newValues = { name: "Alimentação" };

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const adminToken = `Bearer ${adminLoginResponse.body.token}`;

    const response = await request(app)
      .patch(`${baseUrl}/13970660-5dbe-423a-9a9d-5c23b37943cff`)
      .set("Authorization", adminToken)
      .send(newValues);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("DELETE /category/:id - Should be able to delete a category", async () => {
    await request(app).post("/users").send(mockedAdmin);
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const adminToken = `Bearer ${adminLoginResponse.body.token}`;

    const categoryToBeDeleted = await request(app)
      .get(baseUrl)
      .set("Authorization", adminToken);

    const response = await request(app)
      .delete(`${baseUrl}/${categoryToBeDeleted.body[0].id}`)
      .set("Authorization", adminToken);

    expect(response.status).toBe(204);
  });

  test("DELETE /category/:id - Should not be able to delete a category not being admin", async () => {
    await request(app).post("/users").send(mockedAdmin);
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const adminToken = `Bearer ${adminLoginResponse.body.token}`;
    const categoryToBeDeleted = await request(app)
      .get(baseUrl)
      .set("Authorization", adminToken);
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);
    const userToken = `Bearer ${userLoginResponse.body.token}`;

    const response = await request(app)
      .delete(`${baseUrl}/${categoryToBeDeleted.body[0].id}`)
      .set("Authorization", userToken);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("DELETE /category/:id - Should not be able to delete a category that doesnt exists", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const adminToken = `Bearer ${adminLoginResponse.body.token}`;

    const response = await request(app)
      .delete(`${baseUrl}/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", adminToken);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

});
