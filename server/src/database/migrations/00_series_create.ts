import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('series', table => {
        table.increments('serieId').primary();
        table.string('serieTitle').notNullable();
        table.string('serieTitleAlter');
        table.string('serieSlug').unique().notNullable();
        table.text('serieSinopse').notNullable();
        table.integer('serieRelease').notNullable();
        table.string('serieStatus').notNullable();
        table.string('serieType').notNullable();
        table.string('serieFolder').notNullable();
        table.string('serieThumbnail').notNullable();
        table.timestamp('serieCreatedAt').defaultTo(knex.fn.now());
        table.timestamp('serieUpdatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('series');
}