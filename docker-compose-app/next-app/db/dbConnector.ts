
// NOTE connect docker
// mysql--host=127.0.0.1 --port=3366 -u root -p --database=db       


// Get the client
import mysql from 'mysql2/promise';

console.log(process.env)
// Create the connection to database
const port = Number.parseInt(process.env.DB_LOCAL_PORT || '3366')
export const dbConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    // host: '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    port 
});

// A simple SELECT query
try {
    const [results, fields] = await dbConnection.query(
        'select * from Test'
    );

    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
} catch (err) {
    console.log(err);
}

// Using placeholders
// try {
//     const [results] = await connection.query(
//         'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
//         ['Page', 45]
//     );

//     console.log(results);
// } catch (err) {
//     console.log(err);
// }