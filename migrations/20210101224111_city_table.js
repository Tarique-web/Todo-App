const { table } = require("../routes/db");

exports.up = (knex) => {
    return knex.schema.createTable("city",(table) => {
        table.increments("id").primary();
        table.string("city").notNullable()

    })

  
};

exports.down = (knex) => {
    return knex.schema.dropTableIfExists("city");
  
};
