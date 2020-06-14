const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const adminPage = (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: "Admin page",
  });
};

const blockUser = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  user.blocked = !user.blocked;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Block-UnblockSuccess",
  });
});

const deleteUser = asyncErrorWrapper(async(req,res,next) => {

    const {id} = req.params;

    const user = await User.findById(id)

    await user.remove();

    return res.status(200).json({
        success : true,
        message : "User Deleted"
    })

})

module.exports = {
  adminPage,
  blockUser,
  deleteUser
};
