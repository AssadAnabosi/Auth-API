import { Schema, model } from "mongoose";
import { SESSIONS, USERS } from "../constants/collections.constants.js";

const options = {
    collection: SESSIONS,
    timestamps: {
        createdAt: "createdAt",
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
};

const SessionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: USERS,
        required: [true, "Please provide a user"],
    },
    token: {
        type: String,
        required: [true, "Please provide a token"],
    },
    expiresAt: {
        type: Date,
        required: [true, "Please provide an expiration date"],
    },
    createdByIp: {
        type: String,
        required: [true, "Please provide an IP address"],
    },
}, options);

SessionSchema.virtual("isExpired").get(function () {
    return Date.now() >= this.expiresAt;
});

SessionSchema.virtual("isActive").get(function () {
    return !this.isExpired;
});

export default model(SESSIONS, SessionSchema);