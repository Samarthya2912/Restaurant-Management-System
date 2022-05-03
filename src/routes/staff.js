const router = require("express").Router();
const staffController = require("../controllers/staffController");
const { contactValidator } = require("../middlewares/contactvalidator");
router.get("/staff/:staff_id/profile", staffController.getStaffProfile);
router.patch(
  "/staff/:staff_id/profile",
  contactValidator,
  staffController.updateStaffProfile
);
router.delete("/staff/:staff_id/profile", staffController.deleteStaffProfile);
router.post("/staff/caterogies", staffController.addCategory);
router.get("/staff/caterogies", staffController.getCategories);
router.patch(
  "/staff/caterogies/:staff_category",
  staffController.updateCategory
);
module.exports = router;
