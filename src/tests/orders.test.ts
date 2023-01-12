import { newOrder } from "./mocks/orders.mock";
import { mockedUser, mockedUserLogin } from "./mocks/users.mock";
import { mockedTable } from "./mocks/tables.mock";
import request from "supertest";
import app from "../app";
import AppDataSource from "../data-source";
import { DataSource } from "typeorm";

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
    await request(app).post("/tables").send(mockedTable);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /orders - should be able to create a order", async () => {
    const user = request(app).get("/users");
    const table = request(app).get("/tables");

    const response = await request(app)
      .post("/orders")
      .send({ ...newOrder, table_id: table[0], client_name: user[0] });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("table_id");
    expect(response.body).toHaveProperty("client_name");
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
