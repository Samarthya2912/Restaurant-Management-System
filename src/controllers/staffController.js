const pool = require("../database/database");
exports.getStaffProfile = async (req, res) => {
  const { staff_id } = req.params;
  try {
    const staff = await pool.query(
      "SELECT user_id,username,email,name,address,phone,staff_category FROM users INNER JOIN contact_info ON users.user_id=contact_info.contact_info_id INNER JOIN staff ON staff.staff_id=users.user_id WHERE staff_id=?",
      [staff_id]
    );
    if (!staff || staff.length == 0) {
      return res.status(404).send({ error: "Staff not found" });
    }
    return res.send(staff[0]);
  } catch (error) {
    return res.status(500).send({ error: "Internal Server error" });
  }
};
exports.updateStaffProfile = async (req, res) => {
  const { name, address, email, phone } = req.body;
  const { staff_id } = req.params;
  try {
    const update = await pool.query(
      "UPDATE contact_info SET name=?,address=?,email=?,phone=? WHERE contact_info_id=?",
      [name, address, email, phone, staff_id]
    );
    if (update.affectedRows != 1) {
      return res.status(403).send({ error: "Error while updating" });
    }
    return res.send({ message: "Successfully updated" });
  } catch (error) {
    return res.send({ error: "Internal Server error." });
  }
};
exports.deleteStaffProfile = async (req, res) => {
  const { staff_id } = req.params;
  try {
    const deleteProfile = await pool.query(
      "DELETE users.*,contact_info.* FROM users INNER JOIN contact_info ON users.user_id=contact_info.contact_info_id WHERE users.user_id=?",
      [staff_id]
    );
    if (deleteProfile.affectedRows > 0) {
      return res.send({ message: "Staff profile deleted" });
    } else {
      return res.status(400).send({ error: "Failed to delete" });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};
exports.addCategory = async (req, res) => {
  const { staff_category, salary } = req.body;
  try {
    const insert = await pool.query(
      "INSERT INTO staff_category SET staff_category=?,salary=?",
      [staff_category, salary]
    );
    if (insert.affectedRows != 1) {
      return res.status(403).send({ error: "Unexpected error occured" });
    }
    return res.send({ message: "Successfully added." });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server error" });
  }
};
exports.getCategories = async (req, res) => {
  try {
    const categories = await pool.query("SELECT * FROM staff_category");
    if (!categories) {
      return res.status(404).send({ error: "Categories not found" });
    }
    return res.send({ staff_category: categories });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server error." });
  }
};
exports.updateCategory = async (req, res) => {
  const { staff_category } = req.params;
  const { salary } = req.body;
  try {
    const update = await pool.query(
      "UPDATE staff_category SET salary=? WHERE staff_category=?",
      [salary, staff_category]
    );
    if (update.affectedRows == 0) {
      return res.status(403).send({ error: "Update failed" });
    }
    return res.send({ message: "Successfully updated" });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server error" });
  }
};
