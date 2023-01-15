import { newOrder } from "./mocks/orders.mock";
import { mockedAdmin, mockedUser } from "./mocks/users.mock";
import { mockedTable } from "./mocks/tables.mock";
import request from "supertest";
import app from "../app";
import AppDataSource from "../data-source";
import { DataSource } from "typeorm";
import { mockedProduct } from "./mocks/products.mock";

describe("Testing /orders", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    await request(app).post("/users").send(mockedUser);
    await request(app).post("/users").send(mockedAdmin);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /orders - should be able to create a order", async () => {
    const adminLogin = await request(app).post("/login").send(mockedAdmin);

    const token = `Bearer ${adminLogin.body.token}`;

    await request(app)
      .post("/tables")
      .set("Authorization", token)
      .send(mockedTable);

    await request(app)
      .post("/products")
      .set("Authorization", token)
      .send(mockedProduct);

    const userInfo = await request(app).get("/users");

    const tableInfo = await request(app)
      .get("/tables")
      .set("Authorization", token);

    const productInfo = await request(app).get("/products");

    const response = await request(app)
      .post("/orders")
      .set("Authorization", token)
      .send({
        table_id: tableInfo.body[0].id,
        user_id: userInfo.body[0].id,
        client_name: "cliente",
        products: [{ id: productInfo.body[0].id }],
      });

    expect(response.body).toEqual(
      expect.objectContaining({
        id: response.body.id,
        client_name: "cliente",
        table: {
          ...tableInfo.body[0],
        },
      })
    );
    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("products");
  });

  test("GET /orders - should be able to list all orders", async () => {
    const user = request(app).get("/users");
    const table = request(app).get("/tables");

    const order = await request(app)
      .post("/orders")
      .send({ ...newOrder, table_id: table[0], client_name: user[0] });

    const response = await request(app).get("/orders");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("map");
  });

  test("GET /orders - should be able to list a especific order", async () => {
    const user = request(app).get("/users");
    const table = request(app).get("/tables");
    const order = await request(app)
      .post("/orders")
      .send({ ...newOrder, table_id: table[0], client_name: user[0] });

    const response = await request(app).get(`/orders/${order.body.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("map");
    expect(response.body).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("createdAt");
    expect(response.body[0]).toHaveProperty("user_id");
    expect(response.body[0]).toHaveProperty("table_id");
    expect(response.body[0]).toHaveProperty("client_name");
  });

  test("GET /orders - should be able to list the closed orders", async () => {
    const user = request(app).get("/users");
    const table = request(app).get("/tables");
    const order = await request(app)
      .post("/orders")
      .send({ ...newOrder, table_id: table[0], client_name: user[0] });

    await request(app).delete(`/orders/${order.body.id}`);

    const response = await request(app).get("/orders/deleted");

    expect(response.status).toBe(200);

    expect(response.body[0]).toHaveProperty("createdAt");
    expect(response.body[0]).toHaveProperty("user_id");
    expect(response.body[0]).toHaveProperty("table_id");
    expect(response.body[0]).toHaveProperty("client_name");
    expect(response.body[0]).toHaveProperty("deletedAt");
  });

  test("DELETE /orders - should be able to delete a order", async () => {
    const user = request(app).get("/users");
    const table = request(app).get("/tables");
    const order = await request(app)
      .post("/orders")
      .send({ ...newOrder, table_id: table[0], client_name: user[0] });

    const response = await request(app).delete(`/orders/${order.body.id}`);

    expect(response.status).toBe(204);
  });

  test("DELETE /orders - should not be able to delete a order that does not exists", async () => {
    const response = await request(app).delete(
      "/orders/484b3b9a-94b9-4827-b21d-a2c67a24cee5"
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
