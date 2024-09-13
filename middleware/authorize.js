const endPointModel = require("../models/endpoints");

function authorized(req, res, next) {
  let pathh = req.path.split("/");
  pathh = pathh[1];
  console.log(pathh);
  async function checkEndpoint() {
    try {
      let data = await endPointModel.findOne({
        endpoint: pathh.toString(),
        role: req.role,
      });
      console.log(pathh.toString(), data);
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
