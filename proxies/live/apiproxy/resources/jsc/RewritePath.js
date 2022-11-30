const { rewrite } = require('./utils');
const { input, output } = properties;

const locationHeader = context.getVariable("message.header.Location");
const newHeader = rewrite(locationHeader, input, output);
context.setVariable("message.header.Location", newHeader);
