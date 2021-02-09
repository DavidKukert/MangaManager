import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('series_rel_tags', table => {
        table.increments('relId').primary();
        table.integer('relSerieId').unsigned().notNullable();
        table.integer('relTagId').unsigned().notNullable();
        table.foreign('relSerieId').references('serieId').inTable('series');
        table.foreign('relTagId').references('tagId').inTable('tags');
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('series_rel_tags');
}