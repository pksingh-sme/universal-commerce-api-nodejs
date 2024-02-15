module.exports = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'mysql123',
        database: process.env.DB_NAME || 'snapxxl',
    },
    jwtSecret: process.env.JWT_SECRET || 'mysnapjwtsecret',
};