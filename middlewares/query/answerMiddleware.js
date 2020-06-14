const asyncErrorWrapper = require("express-async-handler");
const {
  populateHelper,
  paginationHelper,
} = require("./queryMiddlewareHelpers");

const answerMiddleware = function (model, options) {
  return asyncErrorWrapper(async function (req, res, next) {
    //Initial Query
    const { id } = req.params;

    const arrayName = "answers";

    const total = await model.findById(id)["answerCount"];

    const pagiantionResult = await paginationHelper(total, undefined, req);

    const startIndex = pagiantionResult.startIndex;
    const limit = pagiantionResult.limit;

    let queryObject = {};

    queryObject[arrayName] = { $slice: [startIndex, limit] };

    let query = model.find({ _id: id, queryObject });

    query = populateHelper(query, options.populations);

    const queryResults = await query;

    req.queryResults = {
      succeess: true,
      pagination: pagiantionResult.pagination,
      data: queryResults,
    };
    next();
  });
};

module.exports = answerMiddleware;
