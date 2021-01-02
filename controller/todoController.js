const knex = require("../config/db")
const prettyfyTodo = require("../service/logic").prettyfyTodo
const dueDate = require("../service/logic").dueDate
const assignedToQyery = require("../service/logic").assignedToQyery
const moment = require('moment')

//create todo 
exports.createTodo = (req, res) => {

    /**
       * Request Validation
       */
    if (!req.body || JSON.stringify(req.body) == "{}") {
        console.log({ "todoController": "request body con't be empty" })
        return res.status(400).send({
            message: "Request body can not be empty",
            status: 400
        });
    }
    if (!req.body.text || req.body.text == "") {
        return res.status(400).send({
            message: "text  can not be empty",
            status: 400
        });
    }
    if (!req.body.assignedTo || req.body.assignedTo == "") {
        return res.status(400).send({
            message: "assignedTO can not be empty",
            status: 400
        });
    }
    if (!req.body.dueDate || req.body.dueDate == "") {
        return res.status(400).send({
            message: "dueDate can not be empty",
            status: 400
        })
    }


    const today = moment().format("YYYY-MM-DD")
    const dueDate = req.body.dueDate

    if (dueDate !== moment(dueDate).format("YYYY-MM-DD") || (dueDate < today)) {
        res.status(400).send({
            message: "Please set dueDate in this formate  `YYYY-MM-DD` and date shouldn't be previous",
            status: 400
        })
    }


    knex("todos").insert(
        req.body
    )
        .then(() => {
            knex.select(
                "todos.text",
                "todos.assignedTo",
                "todos.dueDate",
                "users.id",
                "users.name",
                "users.email",
                "users.Age",
                "city.Id",
                "city.city"
            )
                .from("todos")
                .join("users", "users.Id", "=", "todos.assignedTo")
                .join("city", "city.id", "=", "users.cityId")
                .where("users.id", req.body.assignedTo)
                .then(async (data) => {
                    console.log(data);

                    let todoData = await prettyfyTodo(data)

                    res.status(200).send({
                        message: todoData,
                        status: 200
                    })

                }).catch((err) => {
                    res.status(500).send({
                        message: err || "assignedTo not found",
                        status: 500
                    })
                })


        }).catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while create todo.",
                status: 500
            });
        })

}

//logged user get his todos

exports.mytodos = (req, res) => {
    var cookie = req.headers.cookie.slice(5);

    knex.select(
        "todos.text",
        "todos.assignedTo",
        "todos.dueDate",
        "users.id",
        "todos.text",
        "todos.assignedTo",
        "todos.dueDate",
        "users.name",
        "users.email",
        "users.Age",
        "city.Id",
        "city.city").from("todos")
        .join("users", "users.id", "=", "todos.assignedTo")
        .join("city", "city.id", "=", "users.cityId")
        .where("users.id", cookie).then(async (data) => {
            if (data.length) {
                let mytodos = await prettyfyTodo(data)
                res.status(200).send({
                    message: mytodos,
                    status: 200
                })
            } else {
                res.status(200).send({
                    message: "todos is empty",
                    status: 200
                })
            }


        }).catch((err) => {

            console.log(err);
            res.status(500).send({
                message: "mytodos not found" || err,
                status: 500
            })
        })


}

//Get All Users Todo with Using Filers


exports.getTodo = async (req, res) => {
    console.log(req.query.assignedTo);
    if (!req.query.assignedTo || !req.query.assignedTo == undefined) {
        return res.status(400).send({
            message: "assignedTo can not be empty"
        })
    }


    let assignedTo = await assignedToQyery(req.query.assignedTo)
    let cityId = req.query.cityId

    if (assignedTo) {

        let dates = await dueDate(req.query);
        if (dates) {
            knex.select("*").from("todos")
                .join("users", "users.Id", "=", "todos.assignedTo")
                .join("city", "city.id", "=", "users.cityId")
                .limit(parseInt(req.query.limit))
                .offset(parseInt(req.query.skip))
                .where(() => {
                    if (assignedTo !== true) {
                        this.whereIn("assignedTo", assignedTo)
                    } else {
                        this.orWhereNotNull('assignedTo')
                    }
                }).andWhere(() => {
                    if (dates != true) {
                        this.whereBetween("dueDate", [dates, fromDueDate, dates.toDueDate])
                    } else {
                        this.orWhereNotNull("dueDate")
                    }
                }).andWhere(() => {
                    if (cityId != undefined) {
                        this.where("cityId", cityId)
                    } else {
                        this.orWhereNotNull("cityId")
                    }
                })
                .then(async (data) => {
                    if (data.length) {

                        let todoData = await prettyfyTodo(data);
                        res.status(200).send({
                            message: todoData,
                            status: 200
                        })
                    } else {
                        res.status(400).send({
                            message: "Data Not Found",
                            status: 400
                        })
                    }
                }).catch((err) => {
                    res.status(500).send({
                        message: "occured err0r while filtering data" || err,
                        status: 500
                    })
                })
        } else {
            res.status(500).send({
                message: "dueDate should be 'YYYY-MM-DD'"
            })

        }
    } else {
        res.status(500).send({
            message: "invalid Query assingedTo,It should be a Number"
        })
    }
}


