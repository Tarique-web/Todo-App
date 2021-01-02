
exports.up = function(knex) {
    return knex.schema.createTable("city",(table) => {
        table.increments("id").primary();
        table.string("city").notNullable()

    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("city");

  
};
