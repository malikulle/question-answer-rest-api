const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtClient } = require("../helpers/tokenHelpers/sendJwtToClient");
const {
  validataUserInput,
  comparePassword,
} = require("../helpers/input/inputHelpers");
const CustomError = require("../helpers/error/CustomError");
const sendEmail = require("../helpers/libraries/sendEmail");

const register = asyncErrorWrapper(async (req, res, next) => {
  const user = await User.create({
    ...req.body,
  });

  sendJwtClient(user, res);
});

const getUser = (req, res, next) => {
  res.json({
    success: true,
    data: {
      ...req.user,
    },
  });
};

const login = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!validataUserInput(email, password)) {
    return next(new CustomError("Please Check Your Input", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!comparePassword(password, user.password)) {
    return next(new CustomError("Please Check Credantials", 400));
  }
  sendJwtClient(user, res);
});

const logout = asyncErrorWrapper(async (req, res, next) => {
  const { NODE_ENV } = process.env;

  return res
    .status(200)
    .cookie("access_token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "Logout Successfull",
    });
});

const imagaUploud = asyncErrorWrapper(async (req, res, next) => {
  console.log(req.savedProfileImage);
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      profile_image: req.savedProfileImage,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Image Uploud success",
    data: user,
  });
});

const forgatPassword = asyncErrorWrapper(async (req, res, next) => {
  const resetEmail = req.body.email;

  const user = await User.findOne({ email: resetEmail });

  if (!user) {
    return next(new CustomError("There is not user with email", 400));
  }
  const resetPasswordToken = user.getResetPasswordTokenFromUser();

  await user.save();

  const resetPasswordUrl = `http://localhost:5000/api/auth/resetPassword?resetPasswordToken=${resetPasswordToken}`;

  const emailTemplate = `
    <h3>Reset Your Password</h3>
    <p>This <a href='${resetPasswordUrl}' target='_blank'>link</a> will expire in 1 hour</p>
  `;
  try {
    await sendEmail({
      from: process.env.SMTP_EMAIL,
      to: resetEmail,
      subject: "Reset Your Password",
      html: emailTemplate,
    });
    return res.status(200).json({
      success: true,
      message: "Email Sendded",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return new CustomError("Email Could not be sent", 500);
  }
});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {
  const { resetPasswordToken } = req.query;

  const { password } = req.body;

  if (!resetPasswordToken) {
    return new CustomError("Please Provide a valid token", 400);
  }

  let user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  user.password = password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Reset Password Proccess Successfull",
  });
});

const editDetails = asyncErrorWrapper(async (req, res, next) => {
  const editInformation = req.body;

  const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = {
  register,
  getUser,
  login,
  logout,
  imagaUploud,
  forgatPassword,
  resetPassword,
  editDetails,
};
