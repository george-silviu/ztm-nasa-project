//this file enables any endpoint to use pagination

const DEFAULT_PAGE_NUMBER = 1;
//in mongo, if we pass 0 as default page number it will return all documents
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query) {
  //get the absolute (numerical) value for the page and limit passed in, in req query params
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;

  //calculate the amount of records that we want to skip if we are on a certain page
  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
}

module.exports = { getPagination };
