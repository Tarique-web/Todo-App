
exports.up = (knex) => {

    knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name', 100).notNullable()
        table.text('email', 50).notNullable()
        table.text('password', 50).notNullable()
        table.integer("Age", 5).notNullable()
        table.integer("cityId").unsigned().references('id').inTable('city');
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    });
    knex.schema.createTable("city",(table) => {
        table.increments("id").primary();"users.id","users.name as name","eMail","age","text","dueDate","cityId","city.name as cityname"
        table.string("city").notNullable()

    });
    return true;



};

exports.down = (knex) => {
    knex.schema.dropTableIfExists("users");
    knex.schema.dropTableIfExists("city");
    return true;

};
