const router = require("express").Router();
const tableController = require("../controllers/tableController");
router.get("/tables", tableController.getTables);
router.post("/table/:table_no", tableController.makeOccupied);
module.exports = router;
