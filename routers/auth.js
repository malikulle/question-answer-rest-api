const express = require("express");
const { register, getUser, login,logout,imagaUploud,forgatPassword,resetPassword,editDetails } = require("../controllers/auth");
const { getAccessToRoute } = require("../middlewares/authorization/auth");
const profileImageUploud = require("../middlewares/libraries/profileImageUploud")
const router = express.Router();




router.post("/register", register);
router.get("/profile", getAccessToRoute, getUser);
router.post("/login", login);
router.post("/logout",getAccessToRoute,logout);
router.post("/uploud",[getAccessToRoute,profileImageUploud.single("profile_image")],imagaUploud)
router.post("/forgotPassword",forgatPassword)
router.put("/resetPassword",resetPassword)
router.put("/edit",getAccessToRoute,editDetails)


module.exports = router;
