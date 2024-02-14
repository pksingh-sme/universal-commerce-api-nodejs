# Node.js User Authentication and User profile API

This is a simple Node.js API application for user authentication with JWT (JSON Web Tokens) using Express.js and MySQL database.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your local machine.
- MySQL database server installed and running.

## Getting Started

To set up and run the application locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/pksingh-sme/node-api.git
   
   npm install

DB_HOST=<your_mysql_host>
DB_USER=<your_mysql_username>
DB_PASSWORD=<your_mysql_password>
DB_NAME=<your_mysql_database>
JWT_SECRET=<your_jwt_secret>

## Usage
## Register a User
Send a POST request to http://localhost:3000/user/register with the following JSON payload:
{
    "username": "your_username",
    "email": "your_email@example.com",
    "password": "your_password"
}

## Login
Send a POST request to http://localhost:3000/auth/login with the following JSON payload:

{
    "email": "your_email@example.com",
    "password": "your_password"
}

## Update Profile
Send a POST request to http://localhost:3000/user/update-profile with the following JSON payload:

{
    "userId": "user_id",
    "phone": "new_phone_number",
    "firstName": "new_first_name",
    "lastName": "new_last_name"
}
