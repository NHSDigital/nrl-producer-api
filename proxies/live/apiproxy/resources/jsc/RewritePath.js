const input = properties.input;
const output = properties.output;

function rewriteIfMatch(path, input, output) {
    return path.replace(RegExp("^" + input + "$"), output);
}

const locationHeader = context.getVariable("message.header.Location");
const newHeader = rewrite(locationHeader, input, output);
context.setVariable("message.header.Location", newHeader);
