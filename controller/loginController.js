const knex = require("../config/db")
const bcrypt = require("bcryptjs");

//user login

exports.login = (req, res) => {
     /**
        * Request Validation
        */

    if (!req.body || JSON.stringify(req.body) == "{}") {
        console.log({ "loginController": "request body con't be empty" })
        return res.status(400).send({
            message: "Request body can not be empty",
            status: 400
        });
    }

    if (!req.body.email || req.body.email == "") {
        return res.status(400).send({
            message: "email can not be empty",
            status: 400
        });
    }

    if (!req.body.password || req.body.password == "") {
        return res.status(400).send({
            message: "password can not be empty",
            status: 400
        });
    }

    knex.select('*')
        .from('users')
        .where("email", req.body.email)
        .then((data) => {
            if (data.length > 0) {

                bcrypt.compare(req.body.password, data[0].password, (err, isMatch) => {

                    if (!isMatch) {

                        res.status(400).send({
                            message: "Password is not correct!",
                            status: 400
                        })
                    } else {

                        console.log({ "Login successfull!": data[0].name });

                        const cookie = (data[0].id)     
                        res.cookie("user",cookie)
                        res.setHeader("content-type", "application/json");
                        res.send({
                            name: data[0].name,
                            message: "login successfully",
                            status: 200
                        })

                    }

                })


            } else {
                res.send({
                    message: "This user doesn't exists! please register it.....",
                    email:req.body.email,
                    status: 200
                })

            }
        }).catch((err) => {
            res.status(500).send({
                message: message.err || "user not found",
                status: 500
            })

        })


}