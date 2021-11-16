function User() {
}

User.create = function (userData) {
  return new Promise((resolve,reject) => {
    resolve({
      id: 0,
      ...userData,
      createdAt: '2021-11-06 05:53:44',
      updatedAt: '2021-11-06 05:53:44'
    });
 });
}

module.exports = User;