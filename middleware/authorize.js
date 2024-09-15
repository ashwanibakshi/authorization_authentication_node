const endPointModel = require("../models/endpoints");

function authorized(req, res, next) {
  let pathh = req.path.split("/");
  pathh = pathh[1];
  async function checkEndpoint() {
    try {
      let data = await endPointModel.findOne({
        endpoint: pathh.toString(),
        role: { $elemMatch: { $eq: req.role } },
      });
      if (data != null && data != undefined) {
        next();
      } else {
        next({ message: "Unauthorized", statusCode: 401 });
      }
    } catch (error) {
      next({ message: error.message, statusCode: error.statuscode });
    }
  }
  return checkEndpoint();
}

module.exports = authorized;
