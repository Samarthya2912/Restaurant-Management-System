require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.set("view-engine", "ejs");

const port = process.env.PORT || 3000;
app.use("/api", require("./routes/signup"));
app.use("/api", require("./routes/import"));
app.use("/api", require("./routes/login"));
app.use("/api", require("./routes/staff"));
app.use("/api", require("./routes/customer"));
app.use("/api", require("./routes/table"));
app.use("/api", require("./routes/restaurant"));
app.use("/api", require("./routes/stat"));
app.use("/api", require("./routes/reservation"));
app.use("/api", require("./routes/bill"));
app.use("/api", require("./routes/order"));
app.use("/api", require("./routes/food"));
app.use("/api", require("./routes/menu"));
app.use("/api", require("./routes/bill"));
app.listen(port, () => {
  console.log(`Server listening at post ${port}`);
});
