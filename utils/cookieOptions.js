import ms from "ms";

export default time => {
    if (!time) {
        return {
            httpOnly: true,
            sameSite: process.env.COOKIE_SAME_SITE || "Lax",
            secure: process.env.COOKIE_SECURE === "true",
        };
    }
    return {
        httpOnly: true,
        expires: new Date(Date.now() + ms(time)),
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: process.env.COOKIE_SAME_SITE || "Lax",
    };
};