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
    console.log(today);
    const date = req.body.dueDate

    if (date !== moment(date).format("YYYY-MM-DD") || (date < today)) {
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
            console.log(data);
            let mytodos = await prettyfyTodo(data)
            res.status(200).send({
                message: mytodos,
                status: 200
            })
        }).catch((err) => {

            console.log(err);
            res.status(500).send({
                message: "mytodos not found" || err,
                status: 500
            })
        })


}

//geting the todos data to filter

exports.getTodo = async (req, res) => {

 
    var cookie = req.headers.cookie.slice(5);
    let assignedTo = await assignedToQyery(req.query.assignedTo)
    let cityId = req.query.cityId

    if (assignedTo) {

        let dates = await dueDate(req.query);
        if (dates) {
            knex("users")
                .join("todo", 'users.id', "=", "todo.assignedTo")
                .join("city", "users.cityId", "=", "city.id")
                .where(function () {
                    if (assignedTo !== true) {
                        this.whereIn("assignedTo", assignedTo)
                    } else {
                        this.orWhereNotNull('assignedTo')
                    }
                }).andWhere(function () {
                    if (dates != true) {
                        this.whereBetween("dueDate", [dates, fromDueDate, dates.toDueDate])
                    } else {
                        this.orWhereNotNull("dueDate")
                    }
                }).andWhere(function () {
                    if (cityId != undefined) {
                        this.where("cityId", cityId)
                    } else {
                        this.orWhereNotNull("cityId")
                    }
                }).select(
                    "todos.text",
                    "todos.assignedTo",
                    "todos.dueDate",
                    "users.id", "todos.text",
                    "todos.assignedTo",
                    "todos.dueDate",
                    "users.name",
                    "users.email",
                    "users.Age",
                    "city.Id",
                    "city.city").then(async (data) => {
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
                            message: "occured err while filtering data" || err,
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


