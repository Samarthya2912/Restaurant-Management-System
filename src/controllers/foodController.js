const pool = require("../database/database");
module.exports.getFoods = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT food_item_name,food_item_price,food_category_name 
      FROM food_item 
      INNER JOIN food_category 
      USING(food_category_name) ORDER BY food_item_name`
    );
    if (!results) {
      return res.status(404).json({ error: "Unexpected error" });
    }
    return res.send({ food_items: results });
  } catch (error) {
    return res.send({ error });
  }
};
module.exports.addFood = async (req, res) => {
  const { food_item_name, food_item_price, category } = req.body;
  try {
    if (!food_item_name || food_item_name.length == 0) {
      return res
        .status(403)
        .send({ error: "Cannot add food item without name" });
    } else if (!food_item_price) {
      return res
        .status(403)
        .send({ error: "Cannot add food item without price." });
    } else if (
      !category ||
      !category.food_category_name ||
      category.food_category_name.length == 0
    ) {
      return res
        .status(403)
        .send({ error: "Cannot add food item without category" });
    } else {
      const insert = await pool.query(
        "INSERT INTO food_item SET food_item_name=?,food_item_price=?,food_category_name=?",
        [food_item_name, food_item_price, category.food_category_name]
      );
      if (insert.affectedRows == 1) {
        return res.send({ message: "Successfully added." });
      } else {
        return res.status(400).send({ error: "Unable to add a food." });
      }
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY")
      return res.status(500).send({ error: `${name} already exists.` });
    else return res.status(500).send({ error });
  }
};
module.exports.getFoodsByCategory = async (req, res) => {
  const { food_category_name } = req.params;
  try {
    const results = await pool.query(
      `SELECT f.food_item_name,f.food_item_price,cat.food_category_name 
      FROM food_item AS f 
      JOIN food_category AS cat 
      ON f.food_category_name= cat.food_category_name
      where cat.food_category_name=? 
      ORDER BY f.food_item_name
    `,
      [food_category_name]
    );
    if (!results) {
      return res.status(404).send({ error: "Unexpected error." });
    } else {
      return res.send({ food_items: results });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};
module.exports.updateFoodItem = async (req, res) => {
  const { name, price, category } = req.body;
  const { food_item_name } = req.params;
  try {
    if (!food_item_name) {
      return res.status(403).send({ error: "Cannot update post." });
    } else if (!name || name.length == 0) {
      return res
        .status(403)
        .send({ error: "Cannot update food item without name" });
    } else if (!price) {
      return res
        .status(403)
        .send({ error: "Cannot update food item without price." });
    } else if (
      !category ||
      !category.food_category_name ||
      category.food_category_name.length == 0
    ) {
      return res.status(403).send({
        error: "Cannot update food item without category"
      });
    } else {
      const update = await pool.query(
        "UPDATE food_item SET food_item_name=?,food_item_price=?,food_category_name=? WHERE food_item_name=?",
        [name, price, category.food_category_name, food_item_name]
      );
      if (update.affectedRows == 1) {
        return res.send({ message: "Successfully updated." });
      } else {
        return res.status(400).send({ error: "Unable to update a food." });
      }
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY")
      return res.status(500).send({ error: `${name} already exists.` });
    else return res.status(500).send({ error: "Internal server error." });
  }
};
module.exports.deleteFoodItem = async (req, res) => {
  const { food_item_name } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM food_item WHERE food_item_name=?",
      [food_item_name]
    );
    if (result.affectedRows == 1) {
      return res.send({ message: "Successfully deleted." });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal Server error" });
  }
};

module.exports.getFoodCategory = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT food_category_name
      FROM food_category`
    );
    if (!results) {
      return res.status(404).send({ error: "Unexpected error" });
    }
    return res.send({ food_categories: results });
  } catch (error) {
    return res.send({ error: "Internal server error." });
  }
};
exports.addFoodCategory = async (req, res) => {
  const { food_category_name } = req.body;
  try {
    const insert = await pool.query("INSERT INTO food_category SET food_category_name=?", [food_category_name]);
    if (insert.affectedRows == 1) {
      return res.send({ message: "Inserted successfully" });
    }
    return res.status(403).send({ error: "Unable to add category" });
  } catch (error) {
    return res.status(500).send({ error });
  }
};