const pool = require("../database/database");
exports.getCustomerProfile = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await pool.query(
      "SELECT user_id,username,email,name,address,phone FROM users INNER JOIN contact_info ON users.user_id=contact_info.contact_info_id WHERE user_id=?",
      [user_id]
    );
    if (!user || user.length == 0) {
      return res.status(404).send({ error: "Customer not found" });
    }
    return res.send(user[0]);
  } catch (error) {
    return res.status(500).send({ error: "Internal Server error" });
  }
};
exports.updateCustomerProfile = async (req, res) => {
  const { user_id } = req.params;
  const { email, name, address, phone } = req.body;
  try {
    const hasEmail = await pool.query(
      "SELECT * FROM contact_info WHERE email=? AND contact_info_id!=?",
      [email, user_id]
    );
    if (hasEmail.length > 0) {
      return res
        .status(403)
        .send({ error: "Email already exists. Cannot update" });
    }
    const update = await pool.query(
      "UPDATE contact_info SET email=?,name=?,address=?,phone=? WHERE contact_info_id=?",
      [email, name, address, phone, user_id]
    );
    if (update.affectedRows == 0) {
      return res.status(422).send({ error: "Profile update failed" });
    }
    return res.send({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};
