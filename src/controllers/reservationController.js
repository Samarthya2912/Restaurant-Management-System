const pool = require("../database/database");

module.exports.addReservation = async (req, res) => {
  const { no_of_person, reserved_for_date, reserved_for_time } = req.body;
  const { customer_id } = req.params;
  const hasReservation = await pool.query(
    "SELECT * FROM reservation WHERE customer_id=? AND reservation_fulfilled_status=?",
    [customer_id, 0]
  );
  if (hasReservation.length > 0) {
    return res.status(500).send({ error: "Customer already has reservation" });
  }
  const table_no = await pool.query(
    "SELECT table_no from restaurant_table where is_empty=1 limit 1"
  );
  if (table_no.length == 0) {
    return res.send({ error: "Restaurant is full" });
  }
  console.log(req.params, req.body, table_no[0].table_no);
  try {
    const insertreservation = await pool.query(
      `INSERT INTO reservation SET customer_id=?,number_of_person=?,table_no=?,reserved_for_date=?,reserved_for_time=?`,
      [
        customer_id,
        parseInt(no_of_person),
        table_no[0].table_no,
        reserved_for_date,
        reserved_for_time
      ]
    );
    console.log(insertreservation);
    if (insertreservation.affectedRows == 1) {
      await pool.query(
        "UPDATE restaurant_table SET is_empty=? WHERE table_no=?",
        [0, parseInt(table_no[0].table_no)]
      );
      return res.send({ message: "Reservation successfully added." });
    } else {
      return res.status(400).send({ error: "Unable to add reservation." });
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(500).send({
        error: "Reservation with given credentials already exists."
      });
    } else {
      return res.status(500).send({ error });
    }
  }
};

module.exports.getReservations = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT customer_id,name,phone,email,address,reservation_date,reserved_for_date,reserved_for_time,table_no,number_of_person FROM reservation INNER JOIN users ON reservation.customer_id= users.user_id INNER JOIN contact_info ON users.user_id= contact_info.contact_info_id ORDER BY reservation_date`
    );
    if (!results) {
      return res.status(404).json({ error: "Unable to get Reservations." });
    }
    return res.send({ reservations: results });
  } catch (error) {
    return res.send({ error });
  }
};

module.exports.getReservation = async (req, res) => {
  const { reserved_for_date } = req.params;

  try {
    const result = await pool.query(
      `SELECT name,phone,email,address,reservation_date,customer_id,reserved_for_time,table_no,number_of_person FROM reservation INNER JOIN users ON reservation.customer_id= users.user_id INNER JOIN contact_info ON users.user_id= contact_info.contact_info_id where DATE(reserved_for_date)=?`,
      [reserved_for_date]
    );
    if (!result) {
      return res.status(404).json({ error: "Couldn't get reservation." });
    }
    return res.send({ reservations: result });
  } catch (error) {
    return res.send({ error });
  }
};

module.exports.getReservationByCustomer = async (req, res) => {
  const { customer_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT name,phone,email,address,reservation_date,reserved_for_date,reserved_for_time,table_no,number_of_person FROM reservation INNER JOIN users ON reservation.customer_id= users.user_id INNER JOIN contact_info ON users.user_id= contact_info.contact_info_id where customer_id=?`,
      [customer_id]
    );
    if (!result) {
      return res.status(404).json({ error: "Couldn't get reservation." });
    }
    return res.send(result);
  } catch (error) {
    return res.send({ error: "Internal Server error." });
  }
};

module.exports.getReservationByTable = async (req, res) => {
  const { table_no } = req.params;
  try {
    const result = await pool.query(
      `SELECT customer_id,name,phone,email,address,reservation_date,reserved_for_date,reserved_for_time,number_of_person FROM reservation INNER JOIN users ON reservation.customer_id= users.user_id INNER JOIN contact_info ON users.user_id= contact_info.contact_info_id where table_no=?`,
      [table_no]
    );
    if (!result) {
      return res.status(404).json({ error: "Couldn't get reservation." });
    }
    return res.send({ reservations: result });
  } catch (error) {
    return res.send({ error: "Internal Server error." });
  }
};

module.exports.updateReservation = async (req, res) => {
  const {
    number_of_person,
    reserved_for_date,
    reserved_for_time,
    reservation_fulfilled_status
  } = req.body;
  const { table_no, reservation_date } = req.query;
  if (!table_no || !reservation_date) {
    return res.status(403).send({ error: "Cannot update Reservation." });
  }
  try {
    const updateReservation = await pool.query(
      "UPDATE reservation SET reserved_for_date=?,reserved_for_time=?,number_of_person=?,reservation_fulfilled_status=? WHERE table_no=? and reservation_date=?",
      [
        reserved_for_date,
        reserved_for_time,
        number_of_person,
        reservation_fulfilled_status,
        table_no,
        reservation_date
      ]
    );
    if (updateReservation.affectedRows == 1) {
      return res.send({ message: "Reservation Successfully updated." });
    } else {
      return res.status(400).send({ error: "Unable to update reservation." });
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY")
      return res
        .status(500)
        .send({ error: `Reservation credentials already exists.` });
    else return res.status(500).send({ error });
  }
};

module.exports.deleteReservation = async (req, res) => {
  const { table_no, reservation_date } = req.query;
  try {
    const ReservationDeleteresult = await pool.query(
      "DELETE FROM reservation WHERE table_no=? and reservation_date",
      [table_no, reservation_date]
    );
    if (ReservationDeleteresult.affectedRows == 1) {
      return res.send({ message: " Reservation Successfully deleted." });
    } else {
      return res.status(400).send({ error: "Unable to delete reservation." });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};
