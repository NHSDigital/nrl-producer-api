var developerAppName = context.getVariable('developer.app.name');
var developerAppId = context.getVariable('developer.app.id');
var clientIP = context.getVariable('client.ip');
var allowedProofingLevel = context.getVariable('nhs-login-allowed-proofing-level');

var clientRpDetailsHeader = {
    "developer.app.name": developerAppName,
    "developer.app.id": developerAppId,
    "developer.app.nhs-login-minimum-proofing-level": allowedProofingLevel,
    "client.ip": clientIP
};

context.targetRequest.headers['NHSD-Client-RP-Details'] = clientRpDetailsHeader;
