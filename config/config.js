module.exports = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'mysql123',
        database: process.env.DB_NAME || 'testdb',
    },
    jwtSecret: process.env.JWT_SECRET || 'myjwtsecret',
};
