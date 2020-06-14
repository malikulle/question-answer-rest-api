const express = require("express");
const router = express.Router();

const {
  getAccessToRoute,
  getAdminAccess,
} = require("../middlewares/authorization/auth");
const {
  checkUserIsExist,
} = require("../middlewares/database/databaseErrorHelper");
const { adminPage, blockUser,deleteUser } = require("../controllers/admin");

router.use([getAccessToRoute, getAdminAccess]);
router.get("/block/:id",checkUserIsExist, blockUser);
router.delete("/user/:id",checkUserIsExist,deleteUser)

module.exports = router;
