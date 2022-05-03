const router = require("express").Router();
const customerController = require("../controllers/customerController");
const { contactValidator } = require("../middlewares/contactvalidator");
router.get("/customer/:user_id/profile", customerController.getCustomerProfile);
router.patch(
  "/customer/:user_id/profile",
  contactValidator,
  customerController.updateCustomerProfile
);


module.exports = router;
