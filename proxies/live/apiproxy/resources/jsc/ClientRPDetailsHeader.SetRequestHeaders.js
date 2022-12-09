/*
 * This script is used to set the NHSD-Client-RP-Details header, which is passed
 * to the API.
 * 
 * this contains:
 * 
 *  developer.app.id                                - The APIGEE ID associated with the APIGEE App connecting
 *  developer.app.name                              - The name of the APIGEE App
 *  developer.app.nhs-login-minimum-proofing-level  - The P0/P5/P9 requirement when using User Based Authentication
 *  client.ip                                       - The client's IP address
 * 
 */

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
