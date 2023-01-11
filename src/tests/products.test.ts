import { mockedAdminLogin, mockedUserLogin } from "./mocks/users.mock";
import {
  createProduct,
  invalidProduct,
  mockedProduct,
} from "./mocks/products.mock";
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
    expect(response.body).toHaveProperty("message");
  });
  test("GET /products - should be able to list all products", async () => {
    const response = await request(app).get("/products");
    expect(response.body).toHaveProperty("map");
    expect(response.status).toBe(200);
  });
  test("GET /products/:id - should be able to list a specific product", async () => {
    const products = await request(app).get("/products");
    const response = await request(app).get(
      `/schedules/properties/${products.body[0].id}`
    );

    expect(response.body).toEqual(
      expect.objectContaining({
        name: "",
        id: "",
        price: 1,
        in_stock: true,
        category: {
          name: "",
          id: "",
        },
      })
    );
    expect(response.status).toBe(200);
  });
  test("GET /products/:id - should not be able to list a product that doesnt exists", async () => {
    const response = await request(app).get(
      `/product/13970660-5dbe-423a-9a9d-5c23b37943cf`
    );
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });
  test("GET /products/:id - should not be able to list a product with an invalid id", async () => {
    const response = await request(app).get(
      `/product/b855d86b-d4c9-41cd-ab98-d7fa734c6ce4`
    );
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });
});
