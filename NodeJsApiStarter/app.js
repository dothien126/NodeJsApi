const bodyParser = require("body-parser");
const express = require("express");
const res = require("express/lib/response");
const logger = require("morgan"); // middlewares
const mongoClient = require("mongoose");

//setup connect mongodb
mongoClient
  .connect("mongodb://localhost/nodejsapistarter")
  .then(() => console.log("✔ Connected sucessfully!"))
  .catch((error) =>
    console.error(`❌ Connected database is failed with error is ${error}`)
  );

const app = express();


const deckRoute = require("./routes/deck");
const userRoute = require("./routes/user");

// middlewares
app.use(logger("dev"));
app.use(bodyParser.json());

// routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Server is OK! ",
  });
});

// import user
app.use("/decks", deckRoute);
app.use("/users", userRoute);

// catch: bat loi
app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});

//error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  // response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

//start server
const port = app.get("port") || 3000; //khoi tao port
app.listen(port, () => console.log(`Server is listening on port ${port}`));
