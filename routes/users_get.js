const knex = require("./db");

module.exports = ((router, knex) => {

    router
        .get("/get/allusers", (req, res) => {
            const list_new_data = []
            knex.select(
                "users.id",
                "users.name",
                "users.email",
                "users.Age",
                "city.Id",
                "city.city")
                .from("users")
                .join("city", "city.id", "=", "users.cityId")
                .then((data) => {
                    for (i of data) {
                        console.log(req.query.ageMoreThan);

                        if (i.Age >= req.query.ageMoreThan && i.Id == req.query.cityId) {
                            console.log("working");
                            let new_data = {

                                'id': i.id,
                                'name': i.name,
                                'email': i.email,
                                "age": i.Age,
                                'city': {
                                    'id': i.Id,
                                    'city': i.city
                                }

                            }
                            list_new_data.push(new_data)
                            
                        } else {
                            if (i.Age <= req.query.ageLessThan || i.Id == req.query.cityId) {

                                let new_data = {

                                    'id': i.id,
                                    'name': i.name,
                                    'email': i.email,
                                    "age": i.Age,
                                    'city': {
                                        'id': i.Id,
                                        'city': i.city
                                    }

                                }
                                list_new_data.push(new_data)

                            }
                            else{
                                if (i.Age >=req.query.ageMoreThan ){
                                    let new_data = {

                                        'id': i.id,
                                        'name': i.name,
                                        'email': i.email,
                                        "age": i.Age,
                                        'city': {
                                            'id': i.Id,
                                            'city': i.city
                                        }
    
                                    }
                                    list_new_data.push(new_data)

                                }
                            }
                            

                        }
                        
                    }
                    let list_new_data1 = { "users": list_new_data }
                        // console.log(list_new_data1);
                        res.send(list_new_data1)
                    

                    }).catch((err) => {
                        console.log(err);
                    })
        })


        .get('/get/users/:usersId', (req, res) => {

            const usersId = req.params.usersId
            knex.select(
                "users.id",
                "users.name",
                "users.email",
                "users.Age",
                "city.Id",
                "city.city")
                .from("users")
                .join("city", "city.id", "=", "users.cityId")
                .where("users.id", usersId)
                .then((data) => {

                    let new_data = {
                        'users': [{

                            'id': data[0].id,
                            'name': data[0].name,
                            'email': data[0].email,
                            'city': {
                                'id': data[0].Id,
                                'city': data[0].city
                            }
                        }]
                    }
                    res.send(new_data)
                }).catch((err) => {
                    console.log(err);
                })



        })
})