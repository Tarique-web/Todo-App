const { Router } = require("express");

module.exports = ((router, knex) => {
    router
        .post("/todos", (req, res) => {

            const date = new Date();
            const dateTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
            // console.log(dateTime);


            knex("todos").insert({
                "text": req.body.text,
                "assignedTo": req.body.assignedTo,
                'dueDate': dateTime
            })
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
                        .then((data) => {
                            console.log(data);
                            let new_data = {
                                'todo': {
                                    'text': req.body.text,
                                    'assignedto': {
                                        'id': data[0].id,
                                        'name': data[0].name,
                                        'email': data[0].email,
                                        'city': {
                                            'cityId': data[0].Id,
                                            'city': data[0].city
                                        }
                                    }, "dueDate": data[0].dueDate
                                }
                            }
                            res.send(new_data)


                        }).catch((err) => {
                            console.log(err);
                        })


                }).catch((err) => {
                    console.log(err);
                })

        })


        // List of all todos of the logged in user will come here.
        .get("/get/mytodos", (req, res) => {
            var cookie = req.headers.cookie.slice(5);

            console.log(cookie);
            knex.select(
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
                "city.city").from("todos")
                .join("users", "users.id", "=", "todos.assignedTo")
                .join("city", "city.id", "=", "users.cityId")
                .where("users.id", cookie)
                .then((data) => {
                    // console.log(data);
                    // res.send(data)
                    const new_data_list = []
                    for (i of data) {
                        const new_data = {
                            "todos": [{
                                "text": i.text,
                                "assignedTo": {
                                    "id": i.id,
                                    "name": i.name,
                                    "email": i.email,
                                    "city": {
                                        "cityId": i.Id,
                                        "name": i.city

                                    },
                                    "dueDate": i.dueDate

                                }

                            }]

                        }
                        new_data_list.push(new_data)
                        // console.log(new_data);

                    }
                    res.send(new_data_list)


                }).catch((err) => {
                    console.log(err);
                })



        })

        .get("/get/todos", (req, res) => {

            var assign = (req.query.assignedTo)
            var fromDueDate = (req.query.fromDueDate)

            var cityId = (req.query.cityId)
            // console.log(fromDueDate);
            if (assign != undefined && fromDueDate != undefined && cityId != undefined) {

                console.log("working");
                var assigned = Array.from(assign.split(','), Number);
                knex.select(
                    "todos.text",
                    "todos.assignedTo",
                    "todos.dueDate",
                    "users.id",
                    "users.name",
                    "users.email",
                    "users.Age",
                    "city.Id",
                    "city.city").from("todos")
                    .join("users", "users.id", "=", "todos.assignedTo")
                    .join("city", "city.id", "=", "users.cityId")
                    .whereIn("assignedTo", assigned)
                    .andWhere("dueDate", ">=", Date)
                    .andWhere("cityId", cityId)
                    .then((data) => {

                        res.send(data)

                    }).catch((err) => {
                        console.log(err);
                    })
            }
            else {
                console.log("working1");
                knex.select(
                    "todos.text",
                    "todos.assignedTo",
                    "todos.dueDate",
                    "users.id",
                    "users.name",
                    "users.email",
                    "users.Age",
                    "city.Id",
                    "city.city").from("todos")
                    .join("users", "users.id", "=", "todos.assignedTo")
                    .join("city", "city.id", "=", "users.cityId")
                    .then((data) => {
                       
                        const new_data_list = []
                        for (i of data) {
                        
                            // Get data by assignedTo
                            var assigned = Array.from(assign.split(','), Number);
                            if (assigned!=undefined) {
                                console.log("if working");
                                knex.select(
                                    "todos.text",
                                    "todos.assignedTo",
                                    "todos.dueDate",
                                    "users.id",
                                    "users.name",
                                    "users.email",
                                    "users.Age",
                                    "city.Id",
                                    "city.city").from("todos")
                                    .join("users", "users.id", "=", "todos.assignedTo")
                                    .join("city", "city.id", "=", "users.cityId")
                                    .whereIn("assignedTo",assigned)
                                    .then((data) =>{
                                        res.send(data)
                                        // console.log(data);


                                    }).catch((err)=>{
                                        console.log(err);
                                    })
                               
                                
                            } else {
                                // Get data by cityId
                                if (i.Id == cityId) {
                                    const new_data = {
                                        "todos": [{
                                            "text": i.text,
                                            "assignedTo": {
                                                "id": i.id,
                                                "name": i.name,
                                                "email": i.email,
                                                "city": {
                                                    "cityId": i.Id,
                                                    "name": i.city
                                                },
                                                "dueDate": i.dueDate
                                            }
                                        }]
                                    }
                                    new_data_list.push(new_data)


                                }
                                else {
                                    if(i.dueDate>=fromDueDate){
                                        const new_data = {
                                            "todos": [{
                                                "text": i.text,
                                                "assignedTo": {
                                                    "id": i.id,
                                                    "name": i.name,
                                                    "email": i.email,
                                                    "city": {
                                                        "cityId": i.Id,
                                                        "name": i.city
                                                    },
                                                    "dueDate": i.dueDate
                                                }
                                            }]
                                        }
                                        new_data_list.push(new_data)
                                       

                                    }
                                   


                                }
                            }
                        }
                        // res.send(new_data_list)


                    }).catch((err) => {
                        console.log(err);
                    })
            }

        })


})