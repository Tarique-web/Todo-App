const { Router } = require("express");

module.exports=((router,knex)=>{

    router
        .post("/cities",(req,res)=>{
            const city = req.body.city
            if((city.length)!==0){
                knex.select("*").from("city").where({"city":city})
                .then((data)=>{
                    if(data.length==0){
                        knex.select("city").from("city").insert({"city":city})
                        .then((data)=>{
                            console.log("city name is updated",data);
                            res.send("city name is updated");
                        }).catch((err)=>{
                            console.log(err);
                        })
                    }else{
                        console.log("city name is exist");
                    }
                    
                }).catch((err)=>{
                    console.log(err);
                })

            }else{
                console.log("plz enter the city's name");
            }


        })



})