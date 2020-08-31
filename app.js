const express = require('express');
const body = require("body-parser");
const knex  = require('./routes/db');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
// var cookieParser = require('cookie-parser');



const router = express.Router();

const app = express();
app.use(body.json())
// app.use(cookieParser()); 

// app.use ( body.urlencoded ({ extended : true }));



app.use("/",router);
require('./routes/login')(router,knex,bcrypt)

app.use("/",router);
require('./routes/signup')(router,knex,bcrypt)

app.use("/",router);
require('./routes/city')(router,knex)

app.use("/",router);
require("./routes/todo")(router,knex)

app.use("/",router);
require("./routes/users_get")(router,knex)

var port = 4444;
app.listen(port, () => {
    console.log(`Server is working ${port} on port`);
})