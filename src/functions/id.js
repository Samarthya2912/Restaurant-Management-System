exports.generateId = (prefix = "") => {
    return prefix + Math.round(Date.now() + Math.random()).toString().substr(2, Math.round(Date.now() + Math.random() * 3).toString().length);
};