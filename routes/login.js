
module.exports = (router, knex, bcrypt) => {
    router


        .get('/', (req, res) => {
            res.send("Home")

        })
        .post('/login', (req, res) => {
            knex.select("*")
                .from("users")
                .where('email', req.body.email)
                .then((results) => {
                    if (results.length > 0) {

                        bcrypt.compare(req.body.password, results[0].password, (err, isMatch) => {
                            if (err) {
                                throw err
                            } else if (!isMatch) {

                                console.log("Password doesn't match!")
                                res.send("Password doesn't match!")
                            } else {

                                const cookie = (results[0].id)
                                
                                res.cookie("user",cookie)
                                console.log({ "Login successfull!": results[0].name });
                                res.send({ "You Login successfully!": results[0].name });


                                console.log("Password matches!")
                            }

                        })


                    } else {
                        res.send({ "Error": "This user doesn't exists! please Signup....." })

                    }
                }).catch((err) => {
                    res.send(err)
                })


        })

}