const express = require("express");

const { getAccessToRoute,getAnswerOwnerAccess } = require("../middlewares/authorization/auth");
const {
  addNewAnswerToRoute,
  getAllAnswersByQuestion,
  getSingleAnswer,
  editAnswer,
  deleteAnswer,
  likeAnswer,
  undoLikeAnswer
} = require("../controllers/answer");
const {
  checkAnswerExist,
} = require("../middlewares/database/databaseErrorHelper");

const router = express.Router({ mergeParams: true });

router.post("/", getAccessToRoute, addNewAnswerToRoute);
router.get("/getAllAnswers", getAllAnswersByQuestion);
router.get("/:answer_id", checkAnswerExist, getSingleAnswer);
router.put("/:answer_id",[checkAnswerExist,getAccessToRoute,getAnswerOwnerAccess,],editAnswer)
router.delete("/:answer_id",[checkAnswerExist,getAccessToRoute,getAnswerOwnerAccess,],deleteAnswer)
router.get("/:answer_id/like",[checkAnswerExist,getAccessToRoute],likeAnswer)
router.get("/:answer_id/undoLike",[checkAnswerExist,getAccessToRoute],undoLikeAnswer)

module.exports = router;
