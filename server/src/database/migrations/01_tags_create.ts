import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('tags', table => {
        table.increments('tagId').primary();
        table.string('tagTitle').notNullable();
        table.string('tagSlug').unique().notNullable();
        table.string('tagType').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('tags');
}