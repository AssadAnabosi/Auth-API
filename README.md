# Authentication API
[![Prettier-CI](https://github.com/AssadAnabosi/Auth-API/actions/workflows/Prettier.yml/badge.svg)](https://github.com/AssadAnabosi/Auth-API/actions/workflows/Prettier.yml)

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

| Method |                                     |
|--------|-------------------------------------|
| POST   | /api/auth/register                  |
| POST   | /api/auth/login                     |
| POST   | /api/auth/forgotpassword            |
| PUT    | /api/auth/resetpassword/:resetToken |

#### This API was made with the help of [this](https://youtu.be/YocRq-KesCM) YT tutorial, For more details you can always follow it.
#### P.S: Express server here is of type module not commonJS, therefor some syntax might be different.
