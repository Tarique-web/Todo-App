const { hash } = require("bcryptjs")

module.exports = (router, knex, bcrypt) => {

   router

      .post('/register', (req, res) => {
         const users = {}
         bcrypt.hash(req.body.password, 3).then((hash) => {
            var user = [{
               "name": req.body.name,
               "email": req.body.email,
               "password": hash,
               "Age": req.body.Age,
               "cityId": req.body.cityId
            }]


            knex
               .select('*').from('users')
               .where({ "email": req.body.email })
               .then((data) => {
                  //  console.log(data);

                  if (data.length == 0) {
                     knex('users')
                        .insert(user)
                        .then((results) => {
                           knex.select('users.id',"users.name","users.email","users.age","city.city").from("users")
                              .join("city", "city.id", "=", "users.cityId")
                              .where("email", user[0].email).then((data) => {

                                 let new_data = {
                                    "id":data[0].id,
                                    "name":data[0].name,
                                    "eMail":data[0].email,
                                    "age":data[0].Age,
                                    "city":{
                                       "id":req.body.cityId,
                                       "name":data[0].city
                                    }

                                 }
                                 console.log(new_data);
                                 // console.log(data_city);
                                 res.send(new_data)
                              }).catch((err) => {
                                 console.log(err);
                              })
                        })
                        .catch((err) => {
                           console.log(err);
                        })
                  } else {
                     console.log("Email & name exist")
                     res.send("Email & name exist")
                  }
               }).catch((err) => {
                  console.log(err);
               })








         })
      })

}