module.exports = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'user_db',
        password: process.env.DB_PASSWORD || 'mysql_pass',
        database: process.env.DB_NAME || 'snapxxl',
    },
    razorpayId: process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id',
    razorpaySecret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret',
    razorpayCurrency: process.env.RAZORPAY_CURRENCY || 'INR',
    jwtSecret: process.env.JWT_SECRET || 'mysnapjwtsecret',
    refreshTokenSecret: process.env.REFRESH_JWT_SECRET || 'mysnaprefreshjwtsecret',
    emailUser: process.env.EMAIL_AUTH_USER || 'pksingh.sme@gmail.com',
    emailPassword: process.env.EMAIL_AUTH_PASSWORD || "",
    googleClientId: process.env.GOOGLE_CLIENT_ID || '868167884111-laj6llaeu4hc71k19pflel16798sl9nj.apps.googleusercontent.com'
};