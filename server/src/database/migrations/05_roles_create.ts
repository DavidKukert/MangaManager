import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('roles', table => {
        table.increments('roleId').primary();
        table.string('roleName').notNullable().unique();
        table.json('rolePerms').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('roles');
}