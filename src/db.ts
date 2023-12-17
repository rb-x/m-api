// src/db.ts
import * as r from 'rethinkdb';

let connection: r.Connection | null = null;

export async function getDbConnection() {
    if (!connection) {
        try {
            connection = await r.connect({ host: 'localhost', port: 28015 });
            console.log('Connected to RethinkDB');

            // Create the 'test' database if it doesn't exist
            const databases = await r.dbList().run(connection);
            if (!databases.includes('test')) {
                await r.dbCreate('test').run(connection);
                console.log('Created database "test"');
            }

            // Switch to the 'test' database
            connection.use('test');

            // Create the 'devices' table if it doesn't exist
            const tables = await r.db('test').tableList().run(connection);
            if (!tables.includes('devices')) {
                await r.db('test').tableCreate('devices').run(connection);
                console.log('Created table "devices"');
            }
        } catch (err) {
            console.error('Could not connect to RethinkDB', err);
        }
    }
    return connection;
}

export async function closeDbConnection() {
    if (connection) {
        await connection.close();
        connection = null;
        console.log('Closed connection to RethinkDB');
    }
}