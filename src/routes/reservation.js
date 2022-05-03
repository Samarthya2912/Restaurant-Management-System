const router = require("express").Router();
const reservationController = require("../controllers/reservationController");
router.post("/reservation/:customer_id", reservationController.addReservation);
router.get("/reservations", reservationController.getReservations);
router.get(
  "/reservation/date/:reserved_for_date",
  reservationController.getReservation
);
router.get(
  "/reservation/customer/:customer_id",
  reservationController.getReservationByCustomer
);
router.get(
  "/reservation/table/:table_no",
  reservationController.getReservationByTable
);

router.patch("/reservation/:", reservationController.updateReservation);
router.delete("/reservation", reservationController.deleteReservation);

router.get("/reservationPage/:customer_id", (req, res) => {

  id = { the_id: req.params.customer_id };
  res.render("./reservation.ejs", id);
})
module.exports = router;
