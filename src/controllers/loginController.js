const pool = require("../database/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT user_id,username,password,email,name,address,phone FROM users INNER JOIN contact_info ON users.user_id=contact_info.contact_info_id WHERE username=?",
      [username]
    );
    if (result.length == 0) {
      return res.status(404).send({ error: "Username/password didn't match." });
    } else {
      const isValidPassword = await bcrypt.compare(
        password,
        result[0].password
      );
      if (!isValidPassword) {
        return res
          .status(403)
          .send({ error: "Username/password didn't match." });
      }
      const token = await jwt.sign(
        {
          user_id: result[0].user_id
        },
        process.env.JWT_SECRET
      );
      datta = {
        user_id: result[0].user_id,
        username: result[0].username,
        name: result[0].name,
        email: result[0].email,
        address: result[0].address,
        phone: result[0].phone,
        token
      }
      return res.render("./customer.ejs", datta);
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};
exports.restaurantLogin = async (req, res) => {
  const { staff_category, username, password } = req.body;
  if (!staff_category || staff_category.length == 0) {
    return res.status(403).send({ error: "Staff category must be provided." });
  }
  try {
    const result = await pool.query(
      "SELECT user_id,username,password,email,name,address,phone,staff_category FROM users INNER JOIN contact_info ON users.user_id=contact_info.contact_info_id INNER JOIN staff ON users.user_id= staff.staff_id WHERE users.username=? AND staff.staff_category=?",
      [username, staff_category]
    );
    if (result.length == 0) {
      return res
        .status(403)
        .send({ error: "Username/password/category didn't match." });
    } else {
      const isValidPassword = await bcrypt.compare(
        password,
        result[0].password
      );
      if (!isValidPassword) {
        return res
          .status(403)
          .send({ error: "Username/password/category didn't match." });
      }
      const token = await jwt.sign(
        {
          user_id: result[0].user_id
        },
        process.env.JWT_SECRET
      );
      return res.send({
        staff_id: result[0].user_id,
        username: result[0].username,
        name: result[0].name,
        email: result[0].email,
        address: result[0].address,
        phone: result[0].phone,
        token
      });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};


exports.getUserLoginPage = (req, res) => {
  res.render("./customerLogin.ejs");
}