/*
 * Filename: dbService.js
 * Author: Pramod K Singh
 * Date: February 2024
 * Version: 1.0
 */

const mysql = require('mysql');
const config = require('../../config/config');

// Create MySQL pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
});

// Query function to execute MySQL queries
function query(sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error connecting to MySQL:', err);
                return reject(err);
            }

            connection.query(sql, values, (err, results) => {
                connection.release();
                if (err) {
                    console.error('Error executing query:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });
    });
}

module.exports = {
    query,
};
