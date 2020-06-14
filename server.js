const express = require("express");
const dotenv = require("dotenv");
const router = require("./routers");
const connetDatabase = require("./helpers/database/connectDatabase");
const customErrorHandle = require("./middlewares/errors/customErrorHandler");
const path = require("path")

//Envioremnt Variables
dotenv.config({
  path: "./config/env/config.env",
});

//Mongo Db Connection
connetDatabase();

const app = express();
app.use(express.json())

const PORT = process.env.PORT;
//Route
app.use("/api", router);

//Error
app.use(customErrorHandle);

//Static Files
app.use(express.static(path.join(__dirname,"public")));

//Port Starts
app.listen(PORT, () => {
  console.log("App listening on port " + PORT);
});
