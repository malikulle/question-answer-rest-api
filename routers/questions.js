const express = require("express");
const {
  askNewQuestion,
  getAllQuestions,
  getQuestionById,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undoLikeQuestion,
} = require("../controllers/questions");
const {
  getAccessToRoute,
  getQuestionOwnerAccess,
} = require("../middlewares/authorization/auth");
const {
  checkQuestionExist,
} = require("../middlewares/database/databaseErrorHelper");
const answer = require("./answer");
const questionMiddleware = require("../middlewares/query/questionMiddleware");
const Question = require("../models/Question");
const answerMiddleware = require("../middlewares/query/answerMiddleware");

const router = express.Router();

router.post("/ask", getAccessToRoute, askNewQuestion);
router.get(
  "/",
  questionMiddleware(Question, {
    population: {
      path: "user",
      select: "name profile_image",
    },
  }),
  getAllQuestions
);
router.get(
  "/:id",
  checkQuestionExist,
  answerMiddleware(Question, {
    population: [
      {
        path: "user",
        select: "name,profile_image",
      },
      {
        path: "answers",
        select: "content",
      },
    ],
  }),
  getQuestionById
);
router.put(
  "/:id/edit",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  editQuestion
);
router.delete(
  "/:id/delete",
  [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess],
  deleteQuestion
);

router.get("/:id/like", [getAccessToRoute, checkQuestionExist], likeQuestion);
router.get(
  "/:id/undo",
  [getAccessToRoute, checkQuestionExist],
  undoLikeQuestion
);

router.use("/:question_id/answer", checkQuestionExist, answer);

module.exports = router;
