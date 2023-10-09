const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

//import api v1 routes
const v1 = require("./routes/v1");

const app = express();

//security related cors
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

//logging middleware
app.use(morgan("combined"));

//parse json in body
app.use(express.json());
//serve built version of app front-end
app.use(express.static(path.join(__dirname, "..", "public")));

//mount v1 API routers
app.use("/v1", v1);

//serving react apps with client-side routing
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
