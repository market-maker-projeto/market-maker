import { createUserValid, mockedAdmin, mockedAdminLogin, mockedUserLogin } from "./mocks/users.mock";
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
    const createAdmin = await request(app).post("/users").send(mockedAdmin);
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
    const createAdmin = await request(app).post("/users").send(mockedAdmin);
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
    const createUser = await request(app).post("/users").send(createUserValid);
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
    const createAdmin = await request(app).post("/users").send(mockedAdmin);
    
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
  test("PATCH /products/:id - should be able to edit a product", async () => {
    const newValues = { name: "Hamburguer", price: 32.99 };
    const createAdmin = await request(app).post("/users").send(mockedAdmin);
    
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const token = `Bearer ${adminLoginResponse.body.token}`;
    const productToBeUpdatedRequest = await request(app)
      .get("/products")
      .set("Authorization", token);
    const productsToBeUpdatedId = productToBeUpdatedRequest.body[0].id;
    const response = await request(app)
      .patch(`/products/${productsToBeUpdatedId}`)
      .set("Authorization", token)
      .send(newValues);
    const categoryUpdated = await request(app)
      .get("/products")
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(categoryUpdated.body[0]).toEqual(
      expect.objectContaining({
        name: "",
        id: "",
        price: 1,
        in_stock: true,
        category:{
          name: "",
          id: "" 
        }
      })
    );
  });
  test("PATCH /products/:id - should not be able to edit a product without being admin", async () => {
    const newValues = { name: "Hamburguer", price: 32.99 };
    const createAdmin = await request(app).post("/users").send(mockedAdmin);
    const createUser = await request(app).post("/users").send(createUserValid);
    
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);
    const adminToken = `Bearer ${adminLoginResponse.body.token}`;
    const userToken = `Bearer ${userLoginResponse.body.token}`;

    const productToBeUpdated = await request(app)
      .get("/products")
      .set("Authorization", adminToken);
    const productToBeUpdatedId = productToBeUpdated.body[0].id;

    const response = await request(app)
      .patch(`/products/${productToBeUpdatedId}`)
      .set("Authorization", userToken)
      .send(newValues);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  })

  test("PATCH /products/:id - should not be able to edit a product that doesnt exists", async () => {
    const newValues = { name: "Hamburguer", price: 32.99 };
    const createAdmin = await request(app).post("/users").send(mockedAdmin);
    
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const adminToken = `Bearer ${adminLoginResponse.body.token}`;
    const response = await request(app)
      .patch(`/products/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", adminToken)
      .send(newValues);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  })
  test("PATCH /products/:id - should not be able to edit a product with invalid id", async () => {
    const newValues = { name: "Hamburguer", price: 32.99 };
    const createAdmin = await request(app).post("/users").send(mockedAdmin);
    
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const adminToken = `Bearer ${adminLoginResponse.body.token}`;
    const response = await request(app)
      .patch(`/products/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", adminToken)
      .send(newValues);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  })



  test("DELETE /products/:id - should be able to delete a product", async () => {
    const createAdmin = await request(app).post("/users").send(mockedAdmin);
    
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const adminToken = `Bearer ${adminLoginResponse.body.token}`;
    const productToBeDeleted = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${adminToken}`);
    const response = await request(app)
      .delete(`/products/${productToBeDeleted.body[0].id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(204);
  });
  test("DELETE /products/:id - should not be able to delete not being admin", async () => {
    const createAdmin = await request(app).post("/users").send(mockedAdmin);
    const createUser = await request(app).post("/users").send(createUserValid);
    
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const adminToken = `Bearer ${adminLoginResponse.body.token}`;
    const productToBeDeleted = await request(app)
      .get("/products")
      .set("Authorization", adminToken);
    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);
    const userToken = `Bearer ${userLoginResponse.body.token}`;
    const response = await request(app)
      .delete(`/products/${productToBeDeleted.body[0].id}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });
  test("DELETE /products/:id - should not be able to delete a product that doesnt exists", async () => {
    const createAdmin = await request(app).post("/users").send(mockedAdmin);
    
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const adminToken = `Bearer ${adminLoginResponse.body.token}`;

    const response = await request(app)
      .delete(`/products/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });
  test("DELETE /products/:id - should not be able to delete a product with invalid id", async () => {
    const createAdmin = await request(app).post("/users").send(mockedAdmin);
    
    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const adminToken = `Bearer ${adminLoginResponse.body.token}`;

    const response = await request(app)
      .delete(`/product/b855d86b-d4c9-41cd-ab98-d7fa734c6ce4`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });
});
