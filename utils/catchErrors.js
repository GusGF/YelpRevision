// A convenient wrapper for async functions
function catchErrors(theFunc) {
  // console.log("************* catchErrors ************")
  return function (req, res, next) {
    theFunc(req, res, next).catch(e => next(e))
  }
}

module.exports = catchErrors