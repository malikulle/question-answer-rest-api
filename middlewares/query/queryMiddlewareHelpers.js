const searchHelper = (searchKey, query, req) => {
  //search
  if (req.query.search) {
    const searchObject = {};
    const regex = new RegExp(req.query.search, "i");
    searchObject[searchKey] = regex;
    return query.where(searchObject);
  }

  return query;
};

const populateHelper = (query, population) => {
  return query.populate(population);
};

const questionSortHelper = (query, req) => {
  const sortKey = req.query.sortBy;

  if (sortKey === "most-answered") {
    return query.sort("-answerCount");
  }
  if (sortKey === "most-liked") {
    return query.sort("-likeCount");
  }
  return query.sort("-createdAt");
};

const paginationHelper = async (totalDocuments, query, req) => {
  //Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const pagination = {};
  const total = totalDocuments;

  if (startIndex > 0) {
    pagination.previous = {
      page: parseInt(page) - 1,
      limit: limit,
    };
  }
  if (endIndex < total) {
    pagination.next = {
      page: parseInt(page) + 1,
      limit: limit,
    };
  }

  return {
    query:
      query === undefined ? undefined : query.skip(startIndex).limit(limit),
    pagination: pagination,
    startIndex,
    limit,
  };
};

module.exports = {
  searchHelper,
  populateHelper,
  questionSortHelper,
  paginationHelper,
};
