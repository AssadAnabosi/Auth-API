# Authentication API

Express, Mongodb (mongoose), JWT, and nodemailer all combined were used to make this Auth API.

## Configuration :
In the root directory fill the file ```config.env.template``` and rename it ```config.env``` :

## Quick Start :

```
// Install dependencies 
npm install

//Run Server
npm start 

```

## Routes

| Method |                                      |
|--------|--------------------------------------|
| POST   | /api/auth/login                      |
| POST   | /api/auth/refresh                    |
| POST   | /api/auth/register                   |
| POST   | /api/auth/forgot-password            |
| PUT    | /api/auth/reset-password/:resetToken |
| POST    | /api/auth/logout                     |
