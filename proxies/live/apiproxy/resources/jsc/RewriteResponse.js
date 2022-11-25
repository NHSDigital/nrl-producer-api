const { rewrite } = require('Rewrite.utils.js');
const { input, output } = properties;

const locationHeader = context.getVariable("message.header.Location");
const newHeader = rewrite(locationHeader);
context.setVariable("message.header.Location", newHeader);

module.exports = { rewrite };
