const express = require("express");
const router = express.Router();
const {
  checkUserIsExist,
} = require("../middlewares/database/databaseErrorHelper");

const { getSingleUser, getAllUsers } = require("../controllers/user");
const userMiddleware = require("../middlewares/query/userMiddleware");

const User = require("../models/User");

router.get("/", userMiddleware(User), getAllUsers);
router.get("/:id", checkUserIsExist, getSingleUser);

module.exports = router;
