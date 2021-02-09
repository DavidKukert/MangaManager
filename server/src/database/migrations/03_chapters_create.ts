import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('chapters', table => {
        table.increments('chapterId').primary();
        table.integer('chapterNumber').notNullable();
        table.string('chapterTitle');
        table.integer('chapterSerieId').unsigned().notNullable();
        table.json('chapterPages').notNullable();
        table.timestamp('chapterCreatedAt').defaultTo(knex.fn.now());
        table.timestamp('chapterUpdatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.foreign('chapterSerieId').references('serieId').inTable('series');
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('chapters');
}