
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'Tarique@123',
        database: 'Todo'

    }

})


knex.schema.hasTable('users').then(function (exists) {
    if (!exists) {
        return knex.schema.createTable('users', function (table) {
            table.increments('id').primary();
            table.string('name', 100);
            table.text('email', 50);
            table.text('password', 50);
            table.integer("Age", 5);
            table.integer("cityId").unsigned().references('id').inTable('city');

        });
    } else {
        console.log('already exist! table');
    }
}).catch((err)=>{
    console.log(err);
})

knex.schema.hasTable("city").then(function (exists) {
    if (!exists) {
        return knex.schema.createTable("city", function (table) {

            table.increments("id").primary();
            table.string("city");

        })

    } else {
        console.log("Table already exist!....")
    }
}).catch((err)=>{
    console.log(err);
})


knex.schema.hasTable("todos").then((exists) => {
    if (!exists) {
        return knex.schema.createTable("todos", (table) => {
            table.string("text", 100);
            table.integer("assignedTo");
            table.text("dueDate", 50);

        })

    } else {
        console.log("Table already exist!....")
    }


}).catch((err) => {
    console.log(err);

})

module.exports=knex;
