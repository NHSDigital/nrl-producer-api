const rewrite = require('./utils');
const input = properties.input;
const output = properties.output;

const locationHeader = context.getVariable("message.header.Location");
const newHeader = rewrite(locationHeader, input, output);
context.setVariable("message.header.Location", newHeader);
