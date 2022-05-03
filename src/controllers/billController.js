const pool = require("../database/database");
const { generateId } = require("../functions/id");
module.exports.createBill = async (req, res) => {
  const bill_no = generateId("BILL");
  const { order_id } = req.params;
  if (bill_no.length == 0 || !bill_no || order_id.length == 0 || !order_id) {
    return res.send({ error: "Bill number and order id not provided" });
  }
  try {
    const ifEsists = await pool.query(
      "SELECT * FROM bill WHERE order_id=?",
      order_id
    );
    if (ifEsists.length > 0) {
      return res
        .status(403)
        .send({ error: "Bill for this order already exists" });
    }
    const total_price = await pool.query(
      "SELECT COALESCE(SUM(food_item.food_item_price),0) as total_price from food_item INNER JOIN order_item ON food_item.food_item_name=order_item.food_item_name where order_item.order_id=?",
      [order_id]
    );
    const insertbill = await pool.query(
      `INSERT INTO bill SET bill_no=?,order_id=?,total_price=?`,
      [bill_no, order_id, total_price[0].total_price]
    );
    console.log(insertbill);
    if (insertbill.affectedRows == 1) {
      return res.send({ message: "Bill successfully created." });
    } else {
      return res.status(400).send({ error: "Unable to create bill." });
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(500).send({
        error: "Bill with given credentials already exists."
      });
    } else {
      return res.status(500).send({ error });
    }
  }
};

module.exports.getBill = async (req, res) => {
  const { bill_no } = req.params;
  if (!bill_no || bill_no.length == 0) {
    return res.send({ message: "Bill number must be specified" });
  }
  try {
    const getBill = await pool.query(
      "SELECT bill_no,issue_date,order_id,total_price FROM bill WHERE bill_no=? ",
      [bill_no]
    );
    if (getBill.affectedRows != 0) {
      return res.send({ bill: getBill });
    } else {
      return res.status(400).send({ error: "Bill couldn't be obtained" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};

module.exports.getBillByOrder = async (req, res) => {
  const { order_id } = req.params;
  if (!order_id || order_id.length == 0) {
    return res.send({ message: "Order id must be specified" });
  }
  try {
    const getBill = await pool.query(
      "SELECT bill_no,issue_date,order_id,total_price FROM bill WHERE order_id=? ",
      [order_id]
    );
    if (getBill.affectedRows != 0) {
      return res.send({ bill: getBill });
    } else {
      return res.status(400).send({ error: "Bill couldn't be obtained" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};

module.exports.getBillByDate = async (req, res) => {
  const { issue_date } = req.params;
  if (!issue_date || issue_date.length == 0) {
    return res.send({ message: "Issued date of bill must be specified" });
  }
  try {
    const getBill = await pool.query(
      "SELECT bill_no,issue_date,order_id,total_price FROM bill WHERE DATE(issue_date)=? ",
      [issue_date]
    );
    if (getBill.affectedRows != 0) {
      return res.send({ bill: getBill });
    } else {
      return res.status(400).send({ error: "Bill couldn't be obtained" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};
