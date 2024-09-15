const jwt = require("jsonwebtoken");
function authenticate(req, res, next) {
  function check() {
    try {
      let data = req.header("Authorization");
      if (data != null && data != undefined) {
        data = data.split(" ");
        data = jwt.verify(data[1], "thisISMYKEY123");
        req.uid = data["uid"];
        req.role = data["role"];
        next();
      } else {
        res.json({ status: 401, message: "Unauthorized" });
      }
    } catch (error) {
      next({ message: error.message, statusCode: error.statuscode });
    }
  }
  return check();
}

module.exports = authenticate;
