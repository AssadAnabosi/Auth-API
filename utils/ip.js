const requestIP = (req) => {
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7);
    }
    return ip;
};

export default requestIP;
