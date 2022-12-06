const input = properties.input;
const output = properties.output;

function rewrite(path, input, output) {
    return path.replace(RegExp("^" + input + "$"), output);
}

const locationHeader = context.getVariable("message.path");
const newHeader = rewrite(locationHeader, input, output);
context.setVariable("message.path", newHeader);
