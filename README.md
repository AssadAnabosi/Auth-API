# Authentication API
[![Prettier-CI](https://github.com/AssadAnabosi/Auth-API/actions/workflows/Prettier.yml/badge.svg)](https://github.com/AssadAnabosi/Auth-API/actions/workflows/Prettier.yml)

Express, Mongodb (mongoose), JWT, and nodemailer all combined were used to make this Auth API.

## Configuration :
Create a ```config.env``` file in the root directory and fill it with the following information or fill ```config.template.env``` and rename it ```config.env``` :

```
# Server Listening Port
PORT=5000

# Database URI
DB_URI="Your URI Here"

# Frontend URL
URL=""

# JWT Secret

JWT_SECRET="Your JWT Secret"
JWT_EXPIRE=60min

# Password Reset Emails

EMAIL_SERVICE=""
EMAIL_USERNAME=""
EMAIL_PASSWORD=""
EMAIL_FROM=""

```

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
