import { mockedAdminLogin, mockedUserLogin } from './mocks/users.mock';
import { createCategory, mockedCategory } from "./mocks/categories.mock";
import { DataSource } from "typeorm";
import AppDataSource from "../data-source";
import request from "supertest";
import app from "../app";

describe("POST/category", () => {
  let connection: DataSource;
  const baseUrl = "/category";

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

  test("POST /category - Must be able to create a category", async () => {
    const response = await request(app).post(baseUrl).send(createCategory);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: "Bebidas",
        id: "",
      })
    );
  });
  test("POST /category - should not be able to create a category that already exists", async () => {
    const response = await request(app).post(baseUrl).send(createCategory);
    
    expect(response.body).toHaveProperty("message")
    expect(response.status).toBe(409)
  })

  test("POST /category - should not be able to create a category not being admin", async () => {
    const category = await request(app).get(baseUrl)
    const userLoginResponse = await request(app).post("/login").send(mockedUserLogin);
    mockedCategory.id = category.body[0].id
    const response = await request(app).post('/category').set("Authorization", `Bearer ${userLoginResponse.body.token}`).send(createCategory)

    expect(response.status).toBe(403)
    expect(response.body).toHaveProperty("message")
  })



  test("GET /category - should be able to list all categories", async () => {
    const response = await request(app).get('/category')
    expect(response.body).toHaveProperty("map")
    expect(response.status).toBe(200)
  })

  test("PATCH /category - should be able to edit a category", async () => {
    const newValues = {name: "Alimentação"}
    const adminLoginResponse = await request(app).post("/login").send(mockedAdminLogin);
    const token = `Bearer ${adminLoginResponse.body.token}`

    const categoryToBeUpdatedRequest = await request(app).get("/category").set("Authorization", token)
    const categoryToBeUpdatedId = categoryToBeUpdatedRequest.body[0].id

    const response = await  request(app).patch(`/category/${categoryToBeUpdatedId}`).set("Authorization", token).send(newValues)

    const categoryUpdated = await request(app).get("category").set("Authorization", token)

    expect(response.status).toBe(200)
    expect(categoryUpdated.body[0]).toEqual(
        expect.objectContaining({
            name: "",
            id: "",
        })
    )
  })
  test("PATCH /category - should not be able to edit a category not being admin", async () => {
    const newValues = {name: "Alimentação"}


    const adminLoginResponse = await request(app).post("/login").send(mockedAdminLogin);
    const userLoginResponse = await request(app).post("/login").send(mockedUserLogin);
    const adminToken = `Bearer ${adminLoginResponse.body.token}`
    const userToken = `Bearer ${userLoginResponse.body.token}`

    const categoryToBeUpdated = await request(app).get("category").set("Authorization", adminToken)
    const categoryToBeUpdatedId = categoryToBeUpdated.body[0].id

    const response = await  request(app).patch(`/category/${categoryToBeUpdatedId}`).set("Authorization", userToken).send(newValues)

    expect(response.body).toHaveProperty("message")
    expect(response.status).toBe(403)
  })

  test("DELETE /category - should be able to delete a category", async () => {
    const adminLoginResponse = await request(app).post("/login").send(mockedAdminLogin);
    const adminToken = `Bearer ${adminLoginResponse.body.token}`
    const categoryToBeDeleted = await request(app).get("category").set("Authorization", adminToken)
    
    const response = await request(app).delete(`/users/${categoryToBeDeleted.body[0].id}`).set("Authorization", `Bearer ${adminToken}`)
    
    expect(response.status).toBe(204)
  })

  test("DELETE /category - should not be able to delete a category not being admin", async() => {
    const adminLoginResponse = await request(app).post("/login").send(mockedAdminLogin);
    const adminToken = `Bearer ${adminLoginResponse.body.token}`
    const categoryToBeDeleted = await request(app).get("category").set("Authorization", adminToken)
    const userLoginResponse = await request(app).post("/login").send(mockedUserLogin);
    const userToken = `Bearer ${userLoginResponse.body.token}`

    const response = await request(app).delete(`/users/${categoryToBeDeleted.body[0].id}`).set("Authorization", `Bearer ${userToken}`)
    
    expect(response.body).toHaveProperty("message")
    expect(response.status).toBe(403)
  })

});
