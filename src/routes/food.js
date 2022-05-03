const router = require("express").Router();
const foodController = require("../controllers/foodController");
router.get("/foods", foodController.getFoods);
router.post("/foods", foodController.addFood);
router.get(
  "/foods/category/:food_category_name",
  foodController.getFoodsByCategory
);

router.get("/foodCategory", foodController.getFoodCategory);

router.patch("/food/:food_item_name", foodController.updateFoodItem);
router.delete("/food/:food_item_name", foodController.deleteFoodItem);
router.post("/foodCategory",foodController.addFoodCategory);
router.delete("/foodCategory/:food_category_name",foodController.addFoodCategory);
module.exports = router;
