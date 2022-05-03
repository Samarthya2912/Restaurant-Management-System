const validator = require("validator");
module.exports.contactValidator = async (req, res, next) => {
  const { name, address, email, phone } = req.body;
  if (!validator.isEmail(email)) {
    return res.status(422).send({
      error: "Enter a valid email address."
    });
  }
  if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(name)) {
    return res.status(422).send({ error: "Invalid name provided." });
  }
  if (!address || address.length == 0) {
    return res.status(422).send({ error: "Address must be provided" });
  }
  if (!validator.isMobilePhone(phone)) {
    return res.status(422).send({
      error: "Enter a valid phone number"
    });
  }
  next();
};
