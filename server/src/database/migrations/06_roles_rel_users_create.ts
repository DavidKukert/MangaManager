import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('users_rel_roles', table => {
        table.increments('relId').primary();
        table.integer('relUserId').unsigned().notNullable();
        table.integer('relRoleId').unsigned().notNullable();
        table.foreign('relUserId').references('userId').inTable('users');
        table.foreign('relRoleId').references('roleId').inTable('roles');
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('users_rel_roles');
}