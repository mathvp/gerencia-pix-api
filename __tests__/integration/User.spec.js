const sequelize = require('../../src/database');
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

require('../../src/routes/user.routes')(app);

function createUser(userData) {
  return request(app)
    .post(`/api/${process.env.API_VERSION}/users`)
    .send(userData);
}

describe("POST /users", () => {
  beforeEach(() => {
    console.log(sequelize.models)
    Object.values(sequelize.models).forEach(async (model) => {
      await model.destroy({
        where: {},
        truncate: true
      });
    });
  });

  it("should create user when valid data passed", async () => {
    const response = await createUser({
      first_name: 'Matheus',
      last_name: 'Vieira',
      email: 'mathvp@teste.com',
      password: '123123'
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('first_name', 'Matheus');
    expect(response.body).toHaveProperty('last_name', 'Vieira');
    expect(response.body).toHaveProperty('email', 'mathvp@teste.com');
    expect(response.body).toHaveProperty('password');
    expect(response.body).not.toHaveProperty('propriedadeInvalida');
  });

  it("should encrypt user password", async () => {
    const response = await createUser({
      first_name: 'Test',
      last_name: 'Testando',
      email: 'testando@teste.com',
      password: '123456'
    });

    expect(response.body).toHaveProperty('password');
    expect(response.body).not.toHaveProperty('password', '123456');
  })
});

describe("POST /users/login", () => {
  it("should login successuly when valid user login", async () => {
    const userResponse = await createUser({
      first_name: 'Matheus',
      last_name: 'Vieira',
      email: 'mathvp@teste.com',
      password: '123123'
    });

    const loginResponse = await request(app)
      .post(`/api/${process.env.API_VERSION}/users/login`)
      .send({
        email: 'mathvp@teste.com',
        password: '123123'
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('accessToken')
  });

  it("should not login when wrong credentials provided", async () => {
    const userResponse = await createUser({
      first_name: 'Pedro',
      last_name: 'de Lara',
      email: 'pedrodelara@sbt.com.br',
      password: 'pedroSbt123'
    });

    const loginResponse = await request(app)
      .post(`/api/${process.env.API_VERSION}/users/login`)
      .send({
        email: 'pedrodelara@globo.com',
        password: 'pedroGlobo456'
      });

      console.log(loginResponse)

    expect(loginResponse.status).toBe(401);
    expect(loginResponse.body).not.toHaveProperty('accessToken')
    expect(loginResponse.body).toHaveProperty('error', 'Usuário ou senha incorretos')
  });
});