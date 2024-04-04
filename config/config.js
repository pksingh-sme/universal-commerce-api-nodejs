module.exports = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'rwuser',
        password: process.env.DB_PASSWORD || 'mypass',
        database: process.env.DB_NAME || 'mydb',
    },
    jwtSecret: process.env.JWT_SECRET || 'mysnapjwtsecret',
};
