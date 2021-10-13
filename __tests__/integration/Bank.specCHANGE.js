require('../../src/database');

const Bank = require('../../src/models/Bank');

describe("Test", () => {
  it("should test", async () => {
    const bank = await Bank.create({
      code: 123
    });

    expect(bank.code).toBe(123)
  })
});