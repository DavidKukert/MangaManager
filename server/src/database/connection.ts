import knex from "knex";
import dotenv from "dotenv-safe";
import path from "path";

dotenv.config({
    allowEmptyValues: true
});

const connection = knex(
    {
        client: "mysql",
        connection: {
            host: process.env.HOST,
            database: process.env.DBNAME,
            user: process.env.DBUSER,
            password: process.env.DBPASS
        },
        migrations: {
            directory: path.resolve(__dirname, 'migrations')
        },
        seeds: {
            directory: path.resolve(__dirname, 'seeds')
        },
        useNullAsDefault: true
    }
);

export default connection;