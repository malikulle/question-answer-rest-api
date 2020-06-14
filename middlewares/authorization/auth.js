const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const {
  isTokenInculeded,
  getAccessTokenFromHeader,
} = require("../../helpers/tokenHelpers/sendJwtToClient");
const asyncErrorWrapper = require("express-async-handler");

const Question = require("../../models/Question");
const Answer = require("../../models/Answer");

const getAccessToRoute = (req, res, next) => {
  const { JWT_SECRET_KEY } = process.env;

  if (!isTokenInculeded(req)) {
    return next(
      new CustomError("You are not authorize to access this route", 401)
    );
  }
  const access_token = getAccessTokenFromHeader(req);

  jwt.verify(access_token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new CustomError("You are not authorize to access", 401));
    }
    if (!decoded.isActive) {
      return next(new CustomError("Token is unabled", 401));
    }
    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    };
    next();
  });
};

const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
  const { role } = req.user;

  if (role !== "admin") {
    return next(new CustomError("Only Admin Can accesss this route", 403));
  }
  next();
});

const getQuestionOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const questionId = req.params.id;

  const question = await Question.findById(questionId);

  if (question.user != userId) {
    return next(
      new CustomError("You can not access another question details", 403)
    );
  }
  next();
});

const getAnswerOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const answerId = req.params.answer_id;

  const answer = await Answer.findById(answerId);

  if (answer.user != userId) {
    return next(new CustomError("Only owner can handle this operation", 403));
  }
  next();
});
module.exports = {
  getAccessToRoute,
  getAdminAccess,
  getQuestionOwnerAccess,
  getAnswerOwnerAccess
};
