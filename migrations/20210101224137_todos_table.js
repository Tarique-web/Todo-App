
exports.up = (knex) => {
    return knex.schema.createTable("todos", (table) => {
        table.string("text", 100).notNullable()
        table.integer("assignedTo").notNullable()
        table.text("dueDate", 50).notNullable()
        

    })
};

exports.down = (knex) => {
    return knex.schema.dropTableIfExists("todos");
  
};
