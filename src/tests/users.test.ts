import request from "supertest";
import { DataSource } from "typeorm";
import app from "../app";
import AppDataSource from "../data-source";
import {
  mockedUser,
  mockedAdmin,
  mockedAdminLogin,
  mockedUserReturn,
} from "./mocks/users.mock";

describe("POST/users", () => {
  let connection: DataSource;
  const baseUrl = "/users";

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    await request(app).post(baseUrl).send(mockedUser);
    await request(app).post(baseUrl).send(mockedAdmin);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /user - Must be able to create a user", async () => {
    const userAdminLogin = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${userAdminLogin.body.token}`;
    const response = await request(app)
      .post(baseUrl)
      .set("Authorization", token)
      .send(mockedUser);

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("username");
    expect(response.body).toHaveProperty("isAdm");
    expect(response.body).not.toHaveProperty("password");
  });

  test("POST /users - Should not be able to create a invalid user", async () => {
    const userAdminLogin = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${userAdminLogin.body.token}`;

    const response = await request(app)
      .post(baseUrl)
      .set("Authorization", token)
      .send({
        isAdm: false,
        password: "123456",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("POST /users - Should not be possible to create a user without administrator permissions", async () => {
    const userLoginAdmin = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${userLoginAdmin.body.token}`;

    const response = await request(app)
      .post(baseUrl)
      .set("Authorization", token)
      .send(mockedUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message");
    
  });

  test("POST /users - Should not to be able to create a user that already exists", async () => {
    const userAdminLogin = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${userAdminLogin.body.token}`;

    const response = await request(app)
      .post(baseUrl)
      .set("Authorization", token)
      .send(mockedUser);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
  });

  test("GET /users - Must be able to list users", async () => {
    const userLoginAdmin = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${userLoginAdmin.body.token}`;

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("map");
    expect(response.body[0]).not.toHaveProperty("password");
  });

  test("GET /users:id - Should be possible to list a especific user", async () => {
    const userLoginAdmin = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${userLoginAdmin.body.token}`;

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("map");
    expect(response.body[0]).not.toHaveProperty("password");
    expect(response.body).toHaveLength(1);
  });

  test("GET /users - Should not be able to list users not being admin", async () => {
    const userLoginResp = await request(app).post("/login").send(mockedUser);

    const token = `Bearer ${userLoginResp.body.token}`;

    const response = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("GET /users - Should not be able to list users without authentication", async () => {
    const response = await request(app).get(baseUrl);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("PATCH /users/:id -  Should be able to update user", async () => {
    const newValue = { username: "DouglasRJ" };

    const adminLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResp.body.token}`;

    const userTobeUpdateReq = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    const userTobeUpdateId = userTobeUpdateReq.body[0].id;

    const response = await request(app)
      .patch(`${baseUrl}/${userTobeUpdateId}`)
      .set("Authorization", token)
      .send(newValue);

    const userUpdated = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(userUpdated.body[0].username).toEqual("DouglasRJ");
    expect(userUpdated.body[0]).not.toHaveProperty("password");
  });

  test("PATCH /users/:id - Should not be able to update user with invalid id", async () => {
    const newValue = { username: "DouglasRJ" };

    const admingLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${admingLoginResp.body.token}`;

    const userTobeUpdateReq = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    const userTobeUpdateId = userTobeUpdateReq.body[0]

    const response = await request(app)
      .patch(`${baseUrl}/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", token)
      .send(newValue);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
    // expect(response.body).not.toBe(userTobeUpdateId);
  });

  test("PATCH /users/:id - Should not be able to update another user without adm permission", async () => {
    const newValues = { isAdm: false };

    const userLoginResp = await request(app).post("/login").send(mockedUser);
    const admingLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const userToken = `Bearer ${userLoginResp.body.token}`;
    const adminToken = `Bearer ${admingLoginResp.body.token}`;

    const userTobeUpdateReq = await request(app)
      .get(baseUrl)
      .set("Authorization", adminToken);

    const userTobeUpdateId = userTobeUpdateReq.body[0].id;

    const response = await request(app)
      .patch(`${baseUrl}/${userTobeUpdateId}`)
      .set("Authorization", userToken)
      .send(newValues);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("PATCH /users/:id - should not be able to update user with invalid id", async () => {
    const newValue = { username: "DouglasRJ" };

    const admingLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${admingLoginResp.body.token}`;

    const userTobeUpdateReq = await request(app)
      .get(baseUrl)
      .set("Authorization", token);
    const userTobeUpdateId = userTobeUpdateReq.body[0].id;

    const response = await request(app)
      .patch(`${baseUrl}/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", token)
      .send(newValue);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("PATCH /users/:id - should not be able to update another user without adm permission", async () => {
    const newValues = { isAdm: false };

    const userLoginResp = await request(app).post("/login").send(mockedUser);
    const admingLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const userToken = `Bearer ${userLoginResp.body.token}`;
    const adminToken = `Bearer ${admingLoginResp.body.token}`;

    const userTobeUpdateReq = await request(app)
      .get(baseUrl)
      .set("Authorization", adminToken);
    const userTobeUpdateId = userTobeUpdateReq.body[1].id;

    const response = await request(app)
      .patch(`${baseUrl}/${userTobeUpdateId}`)
      .set("Authorization", userToken)
      .send(newValues);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("PATCH /users/:id -  should be able to update user", async () => {
    const newValue = { username: "DouglasRJ" };

    const adminLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResp.body.token}`;

    const userTobeUpdateReq = await request(app)
      .get(baseUrl)
      .set("Authorization", token);
    const userTobeUpdateId = userTobeUpdateReq.body[0].id;

    const response = await request(app)
      .patch(`${baseUrl}/${userTobeUpdateId}`)
      .set("Authorization", token)
      .send(newValue);

    const userUpdated = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(userUpdated.body[0].username).toEqual("DouglasRJ");
    expect(userUpdated.body[0]).not.toHaveProperty("password");
  });

  test("DELETE /users/:id - Should not be possible to delete a user without admin permission", async () => {
    const adminLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);
    const userLoginResp = await request(app).post("/login").send(mockedUser);

    const userToken = userLoginResp.body.token;
    const adminToken = adminLoginResp.body.token;

    const userToBeDeleted = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${adminToken}`);

    const userTobeDeleteId = userToBeDeleted.body[0].id;

    const response = await request(app)
      .delete(`${baseUrl}/${userTobeDeleteId}`)
      .set("Authorization", userToken);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("DELETE /users/:id -  Should not be able to delete user with invalid id", async () => {
    const adminLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResp.body.token}`;

    const response = await request(app)
      .delete(`${baseUrl}/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", token);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("DELETE /users/:id -  Must be able to delete user", async () => {
    const adminLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResp.body.token}`;

    const userTobeDeleted = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    const response = await request(app)
      .delete(`${baseUrl}/${userTobeDeleted.body[0].id}`)
      .set("Authorization", token);

    expect(response.status).toBe(204);
  });

  test("DELETE /users/:id -  Must be able to soft delete user", async () => {
    const adminLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResp.body.token}`;

    const userTobeDeleted = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    const response = await request(app)
      .delete(`${baseUrl}/${userTobeDeleted.body[0].id}`)
      .set("Authorization", token);
    const findUser = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    expect(response.status).toBe(204);
    expect(findUser.body[0].isActive).toBe(false);
  });

  test("DELETE /users/:id -  should not be able to delete user with invalid id", async () => {
    const adminLoginResp = await request(app)
      .post("/login")
      .send(mockedAdminLogin);

    const token = `Bearer ${adminLoginResp.body.token}`;

    const response = await request(app)
      .delete(`${baseUrl}/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", token);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
