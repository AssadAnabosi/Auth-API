import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "Please provide a first name"],
    },
    last_name: {
        type: String,
        required: [true, "Please provide a last name"],
    },
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an Email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
});

const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Hash password pre-saving
UserSchema.pre("save", async function (next) {
    // if password is NOT modified, then don't hash the hashed value
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    if (this.isModified("first_name")) {
        this.first_name = capitalizeFirstLetter(this.first_name);
    }
    if (this.isModified("last_name")) {
        this.last_name = capitalizeFirstLetter(this.last_name);
    }
    return next();
});

// Check if password matches hashed password
UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.getSignedToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    );
}

UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    //  Expiration Time for Token (15min)
    let time = 15 * (60 * 1000);
    this.resetPasswordTokenExpire = Date.now() + time;

    return resetToken;
}

const User = mongoose.model("User", UserSchema);

export default User;