const validator = require("validator");
exports.credentialsValidator = async (req, res, next) => {
  const { username, password } = req.body;
  if (
    !validator.isLength(username, {
      min: 6
    })
  ) {
    return res.status(422).send({
      error: "Username must be 6 characters long."
    });
  }
  if (
    !validator.isLength(password, {
      min: 8
    })
  ) {
    return res.status(422).send({
      error: "Password must be 8 characters long."
    });
  }
  next();
};
