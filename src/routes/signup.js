const signupController = require("../controllers/signupController");
const { contactValidator } = require("../middlewares/contactvalidator");
const { credentialsValidator } = require("../middlewares/credentialvalidator");
const auth = require("../auth/auth");
const router = require("express").Router();
router.post(
  "/signup/customer",
  credentialsValidator,
  contactValidator,
  signupController.createCustomer
);
router.post(
  "/signup/manager",
  credentialsValidator,
  contactValidator,
  signupController.createManager
);
router.post(
  "/signup/kitchen",
  credentialsValidator,
  contactValidator,
  signupController.createKitchen
);
router.post(
  "/signup/waiter",
  credentialsValidator,
  contactValidator,
  signupController.createWaiter
);
router.get("/signup/customers", signupController.getAllCustomers);
router.get("/signup/staffs", signupController.getAllStaffs);

router.get("/signup/customer", signupController.getAddCustomer);

module.exports = router;
