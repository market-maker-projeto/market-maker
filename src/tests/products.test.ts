import {
  mockedUser,
  mockedAdmin,
  mockedAdminLogin,
  mockedUserLogin,
} from "./mocks/users.mock";
import {
  invalidProduct,
  mockedProduct,
  mockedProductResponse,
} from "./mocks/products.mock";
import request from "supertest";
import app from "../app";
import AppDataSource from "../data-source";
import { DataSource } from "typeorm";
import { mockedCategory } from "./mocks/categories.mock";

describe("POST/products", () => {
  let connection: DataSource;
  const baseUrl = "/products";

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

  test("POST /products - Should be able to create a product", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const adminToken = `Bearer ${adminLoginResponse.body.token}`;

    const categoryGot = await request(app)
      .get("/category")
      .set("Authorization", adminToken);

    mockedProduct.categoryId = categoryGot.body[0].id;

    const response = await request(app).post(baseUrl).send(mockedProduct);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: "",
        ...mockedProduct,
        category: {
          id: "",
          name: "",
        },
      })
    );
  });

  test("POST /products - Should not be able to create a product that already exists", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const adminToken = `Bearer ${adminLoginResponse.body.token}`;

    const categoryGot = await request(app)
      .get("/category")
      .set("Authorization", adminToken);

    mockedProduct.categoryId = categoryGot.body[0].id;

    const response = await request(app).post(baseUrl).send(mockedProduct);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
  });

  test("POST /products - Should not be able to create a product not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const userToken = `Bearer ${userLoginResponse.body.token}`;

    const response = await request(app)
      .post(baseUrl)
      .set("Authorization", userToken)
      .send(mockedProduct);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("POST /products - Should not be able to create an invalid product", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const adminToken = `Bearer ${adminLoginResponse.body.token}`;

    const categoryGot = await request(app)
      .get("/category")
      .set("Authorization", adminToken);

    invalidProduct.categoryId = categoryGot.body[0].id;

    const response = await request(app).post(baseUrl).send(invalidProduct);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("GET /products - Should be able to list all products", async () => {
    const response = await request(app).get(baseUrl);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("map");
  });

  test("GET /products/:id - Should be able to list a specific product", async () => {
    const products = await request(app).get(baseUrl);

    const response = await request(app).get(
      `${baseUrl}/${products.body[0].id}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("map");
    expect(response.body).toHaveLength(1);
  });

  test("GET /products/:id - Should not be able to list a product that doesnt exists", async () => {
    const response = await request(app).get(
      `${baseUrl}/13970660-5dbe-423a-9a9d-5c23b37943cf`
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("PATCH /products/:id - Should be able to edit a product", async () => {
    const newValues = { name: "Hamburguer", price: 32.99 };

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResponse.body.token}`;

    const productToBeUpdatedRequest = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    const productsToBeUpdatedId = productToBeUpdatedRequest.body[0].id;

    const response = await request(app)
      .patch(`${baseUrl}/${productsToBeUpdatedId}`)
      .set("Authorization", token)
      .send(newValues);

    const productUpdated = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(productUpdated[0].name).toBe("Hamburguer");
    expect(productUpdated[0].price).toBe(32.99);
  });

  test("PATCH /products/:id - Should not be able to edit a product without being admin", async () => {
    const newValues = { name: "Hamburguer", price: 32.99 };

    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const userToken = `Bearer ${userLoginResponse.body.token}`;

    const productToBeUpdated = await request(app)
      .get(baseUrl)
      .set("Authorization", userToken);

    const productToBeUpdatedId = productToBeUpdated.body[0].id;

    const response = await request(app)
      .patch(`${baseUrl}/${productToBeUpdatedId}`)
      .set("Authorization", userToken)
      .send(newValues);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("PATCH /products/:id - Should not be able to edit a product that doesnt exists", async () => {
    const newValues = { name: "Hamburguer", price: 32.99 };

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const adminToken = `Bearer ${adminLoginResponse.body.token}`;

    const response = await request(app)
      .patch(`${baseUrl}/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", adminToken)
      .send(newValues);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("DELETE /products/:id - Should be able to delete a product", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const adminToken = `Bearer ${adminLoginResponse.body.token}`;

    const productToBeDeleted = await request(app)
      .get(baseUrl)
      .set("Authorization", adminToken);

    const response = await request(app)
      .delete(`${baseUrl}/${productToBeDeleted.body[0].id}`)
      .set("Authorization", adminToken);

    expect(response.status).toBe(204);
  });

  test("DELETE /products/:id - Should not be able to delete not being admin", async () => {
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const userToken = `Bearer ${userLoginResponse.body.token}`;

    const productToBeDeleted = await request(app)
      .get(baseUrl)
      .set("Authorization", userToken);

    const response = await request(app)
      .delete(`${baseUrl}/${productToBeDeleted.body[0].id}`)
      .set("Authorization", userToken);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("DELETE /products/:id - Should not be able to delete a product that doesnt exists", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const adminToken = `Bearer ${adminLoginResponse.body.token}`;

    const response = await request(app)
      .delete(`${baseUrl}/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", adminToken);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
