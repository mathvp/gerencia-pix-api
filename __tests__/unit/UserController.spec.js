const express = require('express');

const app = express();
app.use(express.json());

jest.mock('../../src/models/User', () => require('./__mock__/User'));

require('../../src/routes/user.routes')(app);

const request = require('supertest');

describe("POST /users", () => {
  it("should create an user and return it when passed data is ok", async () => {
    await request(app)
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        first_name: 'Matheus',
        last_name: 'Vieira',
        email: 'mathvp@teste.com',
        password: '123123'
      })
      .expect(200, {
        id: 0,
        first_name: 'Matheus',
        last_name: 'Vieira',
        email: 'mathvp@teste.com',
        password: '123123',
        createdAt: '2021-11-06 05:53:44',
        updatedAt: '2021-11-06 05:53:44'
      });
  });

  it("should return 400 if no data was sent", async () => {
    await request(app)
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({ })
      .expect(400, { error: "Bad request" });
  });

  it("should return 400 if First Name was not sent", async () => {
    await request(app)
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        last_name: 'Vieira',
        email: 'mathvp@teste.com',
        password: '123123'
      })
      .expect(400, { error: "Bad request" });
  });

  it("should return 400 if Last Name was not sent", async () => {
    await request(app)
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        first_name: 'Matheus',
        email: 'mathvp@teste.com',
        password: '123123'
      })
      .expect(400, { error: "Bad request" });
  });

  it("should return 400 if Email was not sent", async () => {
    await request(app)
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        first_name: 'Matheus',
        last_name: 'Vieira',
        password: '123123'
      })
      .expect(400, { error: "Bad request" });
  });

  it("should return 400 if Password was not sent", async () => {
    await request(app)
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        first_name: 'Matheus',
        last_name: 'Vieira',
        email: 'mathvp@teste.com'
      })
      .expect(400, { error: "Bad request" });
  });
});
