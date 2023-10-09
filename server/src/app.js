const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const planetsRouter = require("./routes/planets/planets.router");
const launchesRouter = require("./routes/launches/launches.router");

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

//mount API routers
app.use("/planets", planetsRouter);
app.use("/launches", launchesRouter);

//serving react apps with client-side routing
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
