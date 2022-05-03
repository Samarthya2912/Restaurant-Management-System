const jwt = require("jsonwebtoken");
const pool = require("../database/database");
const auth = async (req, res, next) => {
  try {   
    if (
      !req.header("Authorization") ||
      req.header("Authorization") === "Bearer null"
    ) {
      return res.status(401).json({ error: "Please authenticate" });
    }
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query(
      "SELECT name,username,email,address,phone,staff_category FROM users LEFT JOIN contact_info ON users.user_id=contact_info.contact_info_id LEFT JOIN staff ON users.user_id=staff.staff_id WHERE users.user_id=?",
      [decoded.user_id]
    );
    if (user.length === 0) {
      return res.status(401).json({ error: "Please authenticate" });
    }
    req.token = token;
    req.user = user[0];
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = auth;
