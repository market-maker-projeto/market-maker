import { mockedAdminLogin, mockedUserLogin } from "./mocks/users.mock";
import { createProduct, invalidProduct, mockedProduct } from "./mocks/products.mock";
import request from "supertest";
import app from "../app";
import AppDataSource from "../data-source";
import { DataSource } from "typeorm";

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
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /products - should be able to create a product", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const adminToken = `Bearer ${adminLoginResponse.body.token}`;
    const categoryGot = await request(app)
      .get("category")
      .set("Authorization", adminToken);

    const product = createProduct;
    product.categoryId = categoryGot.body[0].id;

    const response = await request(app).post(baseUrl).send(product);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: "",
        id: "",
        price: 8.99,
        in_stock: true,
        category: {
          id: "",
          name: "",
        },
      })
    );
  });
  test("POST /products - should not be able to create a product that already exists", async () => {
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const adminToken = `Bearer ${adminLoginResponse.body.token}`;
    const categoryGot = await request(app)
      .get("category")
      .set("Authorization", adminToken);

    const product = createProduct;
    product.categoryId = categoryGot.body[0].id;

    const response = await request(app).post(baseUrl).send(product);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(409);
  });
  test("POST /products - should not be able to create a product not being admin", async () => {
    const products = await request(app).get(baseUrl);
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);
    const userToken = `Bearer ${userLoginResponse.body.token}`;
    mockedProduct.id = products.body[0].id;
    const response = await request(app)
      .post("/category")
      .set("Authorization", `Bearer ${userToken}`)
      .send(createProduct);
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("message");
  });
  test("POST /products - should not be able to create an invalid product", async () => {
    const adminLoginResponse = await request(app)
    .post("/login")
    .send(mockedAdminLogin);
  const adminToken = `Bearer ${adminLoginResponse.body.token}`;
  const categoryGot = await request(app)
    .get("category")
    .set("Authorization", adminToken);

  const product = createProduct;
  product.categoryId = categoryGot.body[0].id;
  const response = await request(app).post(baseUrl).send(invalidProduct);
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message")
  })
});
