exports.up = function (knex) {
  return knex.schema.createTable('notes', (table) => {
    table.uuid('id').primary();
    table.string('title').notNullable();
    table.string('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('user_id').references('id').inTable('users').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('notes');
};
