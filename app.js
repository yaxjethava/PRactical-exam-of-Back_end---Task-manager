const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser")
const port = process.env.PORT || 8001;
const db = require("./config/db");

require("dotenv").config();
app.set('trust proxy', 1) // trust first proxy


app.use(cookieParser());
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use("/", require("./routers/index.Routers"));

app.listen(port, (err) => {
    if (err) {
        console.log("Internal server error :", err.message);
        return false;
    }
    console.log(`Server started successfully http://localhost:${port}/`);
})

module.exports = app;