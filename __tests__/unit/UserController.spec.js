
require('../../src/database');
const bcrypt = require('bcrypt');

const User = require("../../src/models/User");

describe("User", () => {
  it("should encrypt user password", async () => {
    const user = await User.create({
      first_name: "Test",
      last_name: "Testando",
      email: "test@test.com.br",
      password: "123456"
    });

    const compareHash = await bcrypt.compare("123456", user.password);
    console.log(user.password)

    expect(compareHash).toBe(true);
  });
});