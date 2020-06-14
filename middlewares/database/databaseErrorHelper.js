const User = require("../../models/User");
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../../helpers/error/CustomError");

const checkUserIsExist = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new CustomError("User Not Found", 400));
  }
  next();
});

const checkQuestionExist = asyncErrorWrapper(async (req, res, next) => {
  const question_id = req.params.id || req.params.question_id;

  const question = await Question.findById(question_id);

  if (!question) {
    return next(new CustomError("Question Not Found"), 400);
  }
  next();
});

const checkAnswerExist = asyncErrorWrapper(async (req, res, next) => {
  const { answer_id } = req.params;
  const { question_id } = req.params;

  const answer = await Answer.findOne({
    _id: answer_id,
    question: question_id,
  });

  if (!answer) {
    return next(new CustomError("There is no answer", 400));
  }
  next();
});

module.exports = {
  checkUserIsExist,
  checkQuestionExist,
  checkAnswerExist,
};
