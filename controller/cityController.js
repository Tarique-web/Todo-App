const knex = require("../config/db")

// creating city
exports.city = (req,res) => {
    /**
        * Request Validation
        */

       if (!req.body || JSON.stringify(req.body) == "{}") {
        console.log({ "cityController": "request body con't be empty" })
        return res.status(400).send({
            message: "Request body can not be empty",
            status: 400
        });
    }

    if (!req.body.city || req.body.city == "") {
        return res.status(400).send({
            message: "city can not be empty",
            status: 400
        });
    }

    knex.select("*").from("city").where({"city":req.body.city})
                .then((data)=>{
                    if(data.length){
                        knex.select("city").from("city").insert(req.body)
                        .then((data)=>{
                            
                            res.status(200).send({
                                message: "city is inserted",
                                city:req.body.city,
                                status: 200
                            });

                        }).catch((err)=>{
                            res.status(500).send({
                                message:message.err||"Some error occurred while inserting city.",
                                status:500
                            })
                        })
                    }else{
                        res.status(200).send({
                            message: "City is already exist",
                            status: 200
                        })
                    }
                    
                }).catch((err)=>{
                    res.status(500).send({
                        message: message.err || "city not found",
                        status: 500
                    })
                })
}

//Get city All
exports.getCity = (req,res) =>{

    knex.select("*").from("city").then((data)=>{
        res.status(200).send({
            message:data,
            status:200
        })
    }).catch((err)=>{
        res.status(500).send({
            message:err,
            status:500
        })
    })
}