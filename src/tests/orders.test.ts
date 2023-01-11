import { newOder } from "./mocks/orders.mock";
import { createUserValid, mockedUserLogin } from "./mocks/users.mock";
import { createTableValid } from "./mocks/tables.mock";
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
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /orders - should be able to create a order", async () => {
    const user = await request(app).post("/users").send(createUserValid);
    const table = await request(app).post("/tables").send(createTableValid);

    const response = await request(app)
      .post("/orders")
      .send({ ...newOder, table_id: table, client_name: user });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: "",
        createdAt: "",
        user_id: "",
        table_id: "",
        client_name: "",
      })
    );
  });

  test("GET /orders - should be able to list all orders", async () => {
    const user = await request(app).post("/users").send(createUserValid);
    const table = await request(app).post("/tables").send(createTableValid);

    const order = await request(app)
      .post("/orders")
      .send({ ...newOder, table_id: table, client_name: user });

    const response = await request(app).get("/orders");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("map");
  });

  test("GET /orders - should be able to list a especific order", async () => {
    const user = await request(app).post("/users").send(createUserValid);
    const table = await request(app).post("/tables").send(createTableValid);

    const order = await request(app)
      .post("/orders")
      .send({ ...newOder, table_id: table, client_name: user });

    const response = await request(app).get(`/orders/${order.body.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: "",
        createdAt: "",
        user_id: "",
        table_id: "",
        client_name: "",
      })
    );
  });

  test("GET /orders - should be able to list the closed orders", async () => {
    const user = await request(app).post("/users").send(createUserValid);
    const table = await request(app).post("/tables").send(createTableValid);

    const order = await request(app)
      .post("/orders")
      .send({ ...newOder, table_id: table, client_name: user });

    const deletedOrder = await request(app).delete(`/orders/${order.body.id}`);

    const response = await request(app).get("/orders/deleted");

    expect(response.status).toBe(200);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: "",
        createdAt: "",
        user_id: "",
        table_id: "",
        client_name: "",
        deletedAt: "",
      })
    );
  });

  test("DELETE /orders - should be able to delete a order", async () => {
    const user = await request(app).post("/users").send(createUserValid);
    const table = await request(app).post("/tables").send(createTableValid);

    const order = await request(app)
      .post("/orders")
      .send({ ...newOder, table_id: table, client_name: user });

    const response = await request(app).delete(`/orders/${order.body.id}`);

    expect(response.status).toBe(204);
  });

  test("DELETE /orders - should not be able to delete a order that does not exists", async () => {
    const response = await request(app).delete(
      "/orders/484b3b9a-94b9-4827-b21d-a2c67a24cee5"
    );
    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });
});
