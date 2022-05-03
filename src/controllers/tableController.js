const pool = require("../database/database");

exports.getTables = async (req, res) => {
  try {
    const tables = await pool.query("SELECT * FROM restaurant_table");
    return res.send({ restaurant_tables: tables });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server error" });
  }
};
exports.makeOccupied = async (req, res) => {
  const { is_empty } = req.body;
  const { table_no } = req.params;
  try {
    const result = await pool.query(
      "UPDATE restaurant_table SET is_empty=? WHERE table_no=?",
      [is_empty, table_no]
    );
    if (result.affectedRows == 1) {
      return res.send({ message: "Updated" });
    } else {
      return res.status(402).send({ error: "Update failed" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};
