const knex = require("../config/db")
const bcrypt = require("bcryptjs");
const service = require("../service/logic").prettyfyUserDetails

//creating user account

exports.signup = (req, res) => {

    /**
       * Request Validation
       */
    if (!req.body || JSON.stringify(req.body) == "{}") {
        console.log({ "signupController": "request body con't be empty" })
        return res.status(400).send({
            message: "Request body can not be empty",
            status: 400
        });
    }
    if (!req.body.name || req.body.name == "") {
        return res.status(400).send({
            message: "name  can not be empty",
            status: 400
        });
    }
    if (!req.body.Age || req.body.Age == "") {
        return res.status(400).send({
            message: "Age can not be empty",
            status: 400
        });
    }
    if (!req.body.email || req.body.email == "") {
        return res.status(400).send({
            message: "Email can not be empty",
            status: 400
        });
    }
    if (!req.body.cityId || req.body.cityId == "") {
        return res.status(400).send({
            message: "CityId can not be empty",
            status: 400
        });
    }
    if (!req.body.password || req.body.password == "") {
        return res.status(400).send({
            message: "password can not be empty",
            status: 400
        });
    }


    bcrypt.hash(req.body.password, 3).then((hashPassword) => {
        var users = {
            "name": req.body.name,
            "email": req.body.email,
            "password": hashPassword,
            "Age": req.body.Age,
            "cityId": req.body.cityId
        }

        knex
            .select('*').from('users')
            .where({ "email": req.body.email })
            .then((data) => {

                if (data.length == 0) {
                    knex('users')
                        .insert(users)
                        .then(() => {
                            knex.select("*").from("users")
                                .join("city", "city.id", "=", "users.cityId")
                                .where("email", users.email).then(async (data) => {

                                    let userData = await service(data)

                                    res.status(200).send({
                                        message: userData,
                                        status: 200
                                    })
                                }).catch((err) => {
                                    res.status(500).send({
                                        message: message.err || "user not found.",
                                        status: 500
                                    })
                                })
                        })
                        .catch((err) => {
                            res.status(500).send({
                                message: err.message || "Some error occurred while create users account.",
                                status: 500
                            });
                        })
                } else {
                    res.status(400).send({
                        message: "Your account is already exist.",
                        status: 400
                    })
                }
            }).catch((err) => {
                res.status(500).send({
                    message: "user not found.",
                    status: 500
                })
            })
    })
}