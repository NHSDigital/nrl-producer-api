function rewriteIfMatch(path, input, output) {
    return path.replace(RegExp("^" + input + "$"), output);
}

module.exports = {
    rewriteIfMatch
};
