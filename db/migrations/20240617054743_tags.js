exports.up = function (knex) {
  return knex.schema.createTable('tags', (table) => {
    table.uuid('id').primary();
    table.string('title').notNullable();
    table.uuid('user_id').references('id').inTable('users');
    table.uuid('note_id').references('id').inTable('notes').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tags');
};
