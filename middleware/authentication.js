const jwt = require("jsonwebtoken");
function auth(req, res, next) {
  function check() {
    let data = req.header("Authorization").split(" ");
    data = jwt.verify(data[1], "thisISMYKEY123");
    if (data) {
      req.user = data["uid"];
      next();
    } else {
      next();
    }
  }
  return check();
}

module.exports = auth;
