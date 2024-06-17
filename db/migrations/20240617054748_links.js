exports.up = function (knex) {
  return knex.schema.createTable('links', (table) => {
    table.uuid('id').primary();
    table.text('url').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('note_id').references('id').inTable('notes').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('links');
};
