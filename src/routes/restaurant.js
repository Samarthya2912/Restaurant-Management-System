const router = require("express").Router();
const restaurantController = require("../controllers/restaurantController");
const { contactValidator } = require("../middlewares/contactvalidator");
router.post(
  "/restaurant/",
  contactValidator,
  restaurantController.createRestaurant
);
router.patch(
  "/restaurant/:restaurant_id",
  contactValidator,
  restaurantController.updateRestaurant
);
router.get("/restaurant/:restaurant_id/", restaurantController.viewRestaurant);
module.exports = router;
