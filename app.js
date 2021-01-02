const express = require('express');
const body = require("body-parser");
const knex = require("./config/db")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv").config();
const router = express.Router();

const app = express();
app.use(body.json())
app.use ( body.urlencoded ({ extended : true }));

app.use("/", router);
// base URLs
app.use("/signup", require("./router/signupRout"));
app.use("/login",require("./router/loginRout"));
app.use('/city',require("./router/cityRout"));
app.use("/todo",require("./router/todoRout"));


var port = 4444;
app.listen(port, () => {
    console.log(`Server is working ${port} on port`);
})