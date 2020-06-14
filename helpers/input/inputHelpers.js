const bcrypt = require("bcryptjs");

const validataUserInput = (email, password) => {
  return email && password;
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = { validataUserInput, comparePassword };
