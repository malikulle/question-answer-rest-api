const asyncErrorWrapper = require("express-async-handler");
const { searchHelper, paginationHelper } = require("./queryMiddlewareHelpers");

const userMiddleware = function (model, options) {
  return asyncErrorWrapper(async function (req, res, next) {
    //Initial Query
    let query = model.find();
    // search  by name
    query = searchHelper("name", query, req);
    //pagination
    const total = await model.countDocuments()
    const paginatinResult = await paginationHelper(total, query, req);

    query = paginatinResult.query;
    const pagination = paginatinResult.pagination;

    const queryResults = await query.find();

    res.queryResults = {
      success: true,
      count: queryResults.length,
      pagination: pagination,
      data: queryResults,
    };
    next();
  });
};

module.exports = userMiddleware;
