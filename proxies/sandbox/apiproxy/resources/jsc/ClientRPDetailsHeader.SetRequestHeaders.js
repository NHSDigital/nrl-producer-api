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

var clientIP = context.getVariable("client.ip");

var clientRpDetailsHeader = {
  "developer.app.name": "sandbox-app-not-a-real-app",
  "developer.app.id": "sandbox-id-not-a-real-app",
  "developer.app.nhs-login-minimum-proofing-level": "not-a-real-proofing-level",
  "client.ip": clientIP,
};

context.targetRequest.headers["NHSD-Client-RP-Details"] = clientRpDetailsHeader;
