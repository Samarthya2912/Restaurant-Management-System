const pool = require("../database/database");
const { generateId } = require("../functions/id");
exports.deleteOrder = async (req, res) => {
  const { order_id } = req.params;
  try {
    const result = await pool.query("DELETE FROM food_order WHERE order_id=?", [
      order_id
    ]);
    if (result.affectedRows == 1) {
      return res.send({ message: "Successfully deleted." });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal Server error" });
  }
};
exports.showOrders = async (req, res) => {
  const { completed, page } = req.query;
  try {
    const orderIds = await pool.query(
      "SELECT DISTINCT order_id,order_time,table_no from order_item inner join order_relates_table using (order_id) inner join food_order using(order_id) WHERE is_order_complete=? ORDER BY order_time DESC LIMIT ?,5",
      [completed || 0, (parseInt(page) - 1) * 5]
    );
    const toSend = [];
    for (let i = 0; i < orderIds.length; i++) {
      let { order_id, order_time, table_no } = orderIds[i];
      const result = await pool.query(
        "SELECT itm.food_item_name,COALESCE(itm.quantity,1) AS quantity FROM food_order AS ord INNER JOIN order_relates_table AS tbl ON ord.order_id = tbl.order_id INNER JOIN order_item AS itm ON itm.order_id=ord.order_id where ord.order_id=?",
        [orderIds[i].order_id]
      );
      toSend.push({ order_id, order_time, table_no, orders: result });
    }
    const homeOrderIds = await pool.query(
      "SELECT DISTINCT order_id,order_time,home_delivery_no from order_item inner join order_relates_home_delivery using (order_id) inner join food_order using(order_id) WHERE is_order_complete=? ORDER BY order_time DESC LIMIT ?,5",
      [completed || 0, (parseInt(page) - 1) * 5]
    );
    for (let i = 0; i < homeOrderIds.length; i++) {
      let { order_id, order_time, home_delivery_no } = homeOrderIds[i];
      const result = await pool.query(
        "SELECT itm.food_item_name,COALESCE(itm.quantity,1) AS quantity FROM food_order AS ord INNER JOIN order_relates_home_delivery AS tbl ON ord.order_id = tbl.order_id INNER JOIN order_item AS itm ON itm.order_id=ord.order_id where ord.order_id=?",
        [homeOrderIds[i].order_id]
      );
      toSend.push({ order_id, order_time, home_delivery_no, orders: result });
    }
    data = { orders: toSend };
    //return res.send({ orders: toSend });
    console.log(data.orders[0].orders[0].food_item_name);
    res.render("./showorders.ejs", data);
  } catch (error) {
    return res.status(500).send({ error });
  }
};
exports.createTableOrder = async (req, res) => {
  const table_no = req.params.table_no;
  const staff_id = req.params.staff_id;
  const { order_items } = req.body;
  const order_id = generateId("ORD");
  try {
    const insertFoodOrder = await pool.query(
      "INSERT INTO food_order SET order_id=?",
      [order_id]
    );
    if (insertFoodOrder.affectedRows == 1) {
      const insert_staff = await pool.query(
        `INSERT INTO order_relates_staff SET order_id=?,staff_id=?`,
        [order_id, staff_id]
      );
      const insert_table = await pool.query(
        "INSERT INTO order_relates_table SET order_id=?,table_no=?",
        [order_id, table_no]
      );
      if (insert_staff.affectedRows == 1 && insert_table.affectedRows == 1) {
        for (let i = 0; i < order_items.length; i++) {
          console.log(order_items[i]);
          const insert = await pool.query(
            "INSERT INTO order_item SET order_id=?,food_item_name=?,quantity=?",
            [order_id, order_items[i].food_item_name, order_items[i].quantity]
          );
          console.log(insert);
        }
      }
      return res.send({ message: "Order placed" });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};
exports.completeAOrder = async (req, res) => {
  const { order_id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE food_order SET is_order_complete=? WHERE order_id=?",
      [1, order_id]
    );
    if (result.affectedRows == 1) {
      return res.send({ message: "Order completed" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};
exports.getTableOrders = async (req, res) => {
  const { table_no } = req.params;
  const { completed } = req.query;
  try {
    const orderIds = await pool.query(
      "SELECT DISTINCT order_id,order_time,table_no from order_item inner join order_relates_table using (order_id) inner join food_order using(order_id) WHERE is_order_complete=? AND table_no=?",
      [completed || 0, table_no]
    );
    const toSend = [];
    for (let i = 0; i < orderIds.length; i++) {
      let { order_time, order_id, table_no } = orderIds[i];
      const result = await pool.query(
        "SELECT itm.food_item_name,COALESCE(itm.quantity,1) AS quantity FROM food_order AS ord INNER JOIN order_relates_table AS tbl ON ord.order_id = tbl.order_id INNER JOIN order_item AS itm ON itm.order_id=ord.order_id where ord.order_id=?",
        [orderIds[i].order_id]
      );
      toSend.push({ order_time, order_id, table_no, orders: result });
    }
    return res.send({ orders: toSend });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};

module.exports.placeHomeDelivery = async (req, res) => {
  const { customer_id } = req.params;
  const { order_items } = req.body;
  console.log(order_items);
  // console.log(req.body);
  const order_id = generateId("ORD");
  const home_delivery_no = generateId("HD");
  try {
    const placeHomeDelivery = await pool.query(
      "INSERT INTO home_delivery SET customer_id=?, home_delivery_no=?",
      [customer_id, home_delivery_no]
    );
    if (placeHomeDelivery.affectedRows != 0) {
      const insertFoodOrder = await pool.query(
        "INSERT INTO food_order SET order_id=?",
        [order_id]
      );
      if (insertFoodOrder.affectedRows == 1) {
        for (let i = 0; i < order_items.length; i++) {
          console.log(order_items[i]);
          await pool.query(
            "INSERT INTO order_item SET order_id=?,food_item_name=?,quantity=?",
            [order_id, order_items[i].name, order_items[i].count]
          );
        }
        const insertInRelation = await pool.query(
          "INSERT INTO order_relates_home_delivery SET order_id=?,home_delivery_no=?",
          [order_id, home_delivery_no]
        );
        if (insertInRelation.affectedRows != 0) {

          return res.send({ message: "Home Delivery successfully placed." });
        } else {
          return res
            .status(400)
            .send({ error: "Home delivery request could not be placed." });
        }
      }
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(500).send({
        error: "Menu with given credentials already exists."
      });
    } else {
      return res.status(500).send({ error });
    }
  }
};

exports.assignDeliveryStaff = async (req, res) => {
  const { home_delivery_no } = req.params;
  const { staff_id } = req.body;
  try {
    const assignDeliveryStaff = await pool.query(
      "UPDATE home_delivery SET delivery_staff_id=? where home_delivery_no=?",
      [staff_id, home_delivery_no]
    );
    if (assignDeliveryStaff.affectedRows != 0) {
      res.send({ message: "Delivery staff Successfully Assigned." });
    } else {
      res.status(400).send({ error: "Couldn't assign delivery staff." });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  const { home_delivery_no } = req.params;
  try {
    const updateDeliveryStatus = await pool.query(
      "UPDATE home_delivery SET is_delivered=1 where home_delivery_no=?",
      [home_delivery_no]
    );
    if (updateDeliveryStatus.affectedRows != 0) {
      res.send({ message: "Delivery status Successfully updated." });
    } else {
      res.status(400).send({ error: "Couldn't update delivery status." });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};

exports.getHomeDeliveryByCustomer = async (req, res) => {
  const { customer_id } = req.params;
  if (!customer_id || customer_id.length == 0) {
    return res.send({ message: "Customer id must be specified" });
  }
  try {
    const getHomeDelivery = await pool.query(
      "SELECT home_delivery_no,delivery_staff_id,is_delivered, order_id from home_delivery inner join order_relates_home_delivery using(home_delivery_no) where customer_id=?",
      [customer_id]
    );
    console.log(getHomeDelivery);
    if (getHomeDelivery.affectedRows != 0) {
      const toSend = [];
      for (let i = 0; i < getHomeDelivery.length; i++) {
        const {
          home_delivery_no,
          order_time,
          order_id,
          is_delivered,
          delivery_staff_id
        } = getHomeDelivery[i];
        const result = await pool.query(
          "SELECT itm.food_item_name,COALESCE(itm.quantity,1) as quantity FROM food_order as ord inner join order_item as itm on ord.order_id=itm.order_id where ord.order_id=?",
          [getHomeDelivery[i].order_id]
        );
        toSend.push({
          order_time,
          order_id,
          home_delivery_no,
          is_delivered,
          delivery_staff_id,
          orders: result
        });
      }
      return res.send({ orders: toSend });
    } else {
      return res.status(400).send({ error: "Unexpected error" });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};
exports.getHomeDelivery = async (req, res) => {
  const { home_delivery_no } = req.params;
  if (!home_delivery_no || home_delivery_no.length == 0) {
    return res.send({ message: "Home delivery no must be specified" });
  }
  try {
    const getHomeDelivery = await pool.query(
      "SELECT customer_id,delivery_staff_id,is_delivered, order_id from home_delivery inner join order_relates_home_delivery using(home_delivery_no) where home_delivery_no=?",
      [home_delivery_no]
    );
    if (getHomeDelivery.affectedRows != 0) {
      const toSend = [];
      for (let i = 0; i < getHomeDelivery.length; i++) {
        const {
          order_time,
          order_id,
          is_delivered,
          customer_id,
          delivery_staff_id
        } = getHomeDelivery[i];
        const result = await pool.query(
          "SELECT itm.food_item_name,COALESCE(itm.quantity,1) as quantity FROM food_order as ord inner join order_item as itm on ord.order_id=itm.order_id where ord.order_id=?",
          [getHomeDelivery[i].order_id]
        );
        toSend.push({
          order_time,
          order_id,
          customer_id,
          is_delivered,
          delivery_staff_id,
          orders: result
        });
      }
      return res.send({ orders: toSend });
    } else {
      return res.status(400).send({ error: "Unexpected error" });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};
exports.getOrdersByStaff = async (req, res) => {
  const { staff_id } = req.params;
  const { completed } = req.query;
  try {
    const orderIds = await pool.query(
      "SELECT DISTINCT order_id,order_time,staff_id from order_item inner join order_relates_staff using (order_id) inner join food_order using(order_id) WHERE is_order_complete=? AND staff_id=?",
      [completed || 0, staff_id]
    );
    const toSend = [];
    for (let i = 0; i < orderIds.length; i++) {
      let { order_time, order_id, staff_id } = orderIds[i];
      const result = await pool.query(
        "SELECT itm.food_item_name,COALESCE(itm.quantity,1) AS quantity FROM food_order AS ord INNER JOIN order_relates_table AS tbl ON ord.order_id = tbl.order_id INNER JOIN order_item AS itm ON itm.order_id=ord.order_id where ord.order_id=?",
        [orderIds[i].order_id]
      );
      toSend.push({ order_time, order_id, staff_id, orders: result });
    }
    return res.send({ orders: toSend });
  } catch (error) {
    return res.status(500).send({ error });
  }
};
exports.addIntoOrder = async (req, res) => {
  const { order_items } = req.body;
  const { order_id } = req.params;
  try {
    for (let i = 0; i < order_items.length; i++) {
      await pool.query(
        "INSERT INTO order_item SET food_item_name=?,quantity=?,order_id=?",
        [order_items[i].food_item_name, order_items[i].quantity, order_id]
      );
    }
    return res.send({ message: "Inserted." });
  } catch (error) {
    return res.status(500).send({ error });
  }
};
// ***********to be done*****
exports.getCustomerOrders = async (req, res) => {
  const { customer_id } = req.params;
  const { completed } = req.query;
  const orderIds = await pool.query(
    "SELECT DISTINCT ord.order_id,ord.order_time,hd.home_delivery_no from order_relates_home_delivery as rln inner join food_order as ord on rln.order_id=ord.order_id inner join home_delivery as hd on rln.home_delivery_no = hd.home_delivery_no where is_order_complete=? AND customer_id=?",
    [completed, customer_id]
  );
  return res.send(orderIds);
};
// is_order_complete halne############
// completion anusar order haru herne#################
// order ko completion change garne###################
// order ko bill issue garne####################33
// eauta table ko orders herne############
// eauta staff ko orders herne#############
// eauta customer ko herne*********
// homedelivery ko place gerne************
// time anusar order nikalne####################333
// order ko bill banaune**************
// home delivery ko ni bill banaune****************
// eauta kunai order ma aaru items halney###################
// isfoodavailable change garne menu bata##################

// get total bill amounts date anusar
// get total items sold date anusar
// get total profit date anusar
// kk besi sell vaira cha tyo
// SELECT DISTINCT order_id,order_time,table_no from order_item inner join order_relates_table using (order_id) inner join food_order using(order_id) WHERE is_order_complete=?


exports.getHomeMenu = (req, res) => {
  cid = { the_id: req.params.customer_id };
  pool.query("SELECT * FROM `food_item` WHERE food_category_name = 'Breakfast' ", (error, foodresult) => {
    if (error) throw error;

    data = { food: foodresult, id: cid }

    data.food.forEach(element => {
      element.food_item_count = 0;
    });

    res.render("./homemenu.ejs", data);
  });

}
