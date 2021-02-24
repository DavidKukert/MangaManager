import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('users', table => {
        table.increments('userId').primary();
        table.string('userNickName').notNullable().unique();
        table.string('userEmail').unique();
        table.string('userPassWord').notNullable();
        table.string('userSalt').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('users');
}