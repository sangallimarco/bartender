function buildMessage(uri, data) {
    return JSON.stringify({
        uri,
        data
    });
}

module.exports = buildMessage;