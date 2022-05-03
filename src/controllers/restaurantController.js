const pool = require("../database/database");
const { generateId } = require("../functions/id");
exports.createRestaurant = async (req, res) => {
  const rest_id = generateId("REST");
  const {
    name,
    address,
    email,
    phone,
    total_staff,
    capacity,
    total_tables
  } = req.body;
  try {
    const ifExists = await pool.query("SELECT * FROM restaurant");
    if (ifExists.length > 0) {
      return res.status(403).send({ error: "Restaurant already exists" });
    }
    const insertInContact = await pool.query(
      "INSERT INTO contact_info SET contact_info_id=?,name=?,address=?,email=?,phone=?",
      [rest_id, name, address, email, phone]
    );
    if (insertInContact.affectedRows == 1) {
      const insertInRest = await pool.query(
        "INSERT INTO restaurant SET restaurant_id=?,total_staff=?,capacity=?,total_tables=?",
        [rest_id, total_staff, capacity, total_tables]
      );
      if (insertInRest.affectedRows == 1) {
        for (let i = 0; i < total_tables; i++) {
          await pool.query("INSERT INTO restaurant_table SET table_no=?", [
            i + 1
          ]);
        }
        return res.send({ message: "Successfully added" });
      } else {
        await pool.query("DELETE FROM contact_info WHERE contact_info_id=?", [
          rest_id
        ]);
        return res.status(400).send({ error: "Unable to add restaurant" });
      }
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};
exports.updateRestaurant = async (req, res) => {
  const { restaurant_id } = req.params;
  const {
    name,
    address,
    email,
    phone,
    total_staff,
    capacity,
    total_tables
  } = req.body;
  try {
    const hasEmail = await pool.query(
      "SELECT * FROM contact_info WHERE email=? AND contact_info_id!=?",
      [email, restaurant_id]
    );
    if (hasEmail.length > 0) {
      return res
        .status(403)
        .send({ error: "Email already exists. Cannot update" });
    }
    const update = await pool.query(
      "UPDATE contact_info AS c INNER JOIN restaurant AS r ON c.contact_info_id=r.restaurant_id SET c.email=?,c.name=?,c.address=?,c.phone=?,r.total_staff=?,r.capacity=?,r.total_tables=? WHERE r.restaurant_id=?",
      [
        email,
        name,
        address,
        phone,
        total_staff,
        capacity,
        total_tables,
        restaurant_id
      ]
    );
    if (update.affectedRows == 0) {
      return res.status(400).send({ error: "Unable to update" });
    }
    return res.send({ message: "Updated successfully" });
  } catch (error) {
    return res.status(500).send({ error });
  }
};
exports.viewRestaurant = async (req, res) => {
  const { restaurant_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT r.restaurant_id,c.name,c.email,c.address,c.phone,r.total_staff,r.capacity,r.total_tables FROM contact_info AS c INNER JOIN restaurant AS r ON c.contact_info_id=r.restaurant_id WHERE r.restaurant_id=?",
      [restaurant_id]
    );
    if (result.length == 0) {
      return res
        .status(400)
        .send({ error: "Restaurant not found. Pease add one." });
    }
    return res.send(result[0]);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};
