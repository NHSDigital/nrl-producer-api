/* 
 * This JS has been added to rewrite the path 
 *  from /FHIR/R4/xxx
 *  to /production/xxx
 *
 * We are required to do this because we are using the AWS Auto Generated 
 * hostnames for AWS API Gateway and the resulting URL then contains the stage
 * name (e.g. "production"), which must be removed.
 * 
 * We do this by calculating a new path and writing it to the `target_path` 
 * variable.  This variable is then used in the TargetEndpoint 
 * (proxies/live/targets/default.xml) under the HTTPTargetConnection/Path
 */

proxyPathsuffix    = context.getVariable("proxy.pathsuffix");               // -> /FHIR/R4/DocumentReference
targetPathsuffix   = proxyPathsuffix.replace("/FHIR/R4", "/production");    // -> /production/DocumentReference

// If we don't set this then it will add the "/FHIR/R4/DocumentReference"
context.setVariable("target.copy.pathsuffix", false);
// Write the new path into the variable 'target_path'
context.setVariable("target_path", targetPathsuffix);
