proxy_pathsuffix    = context.getVariable("proxy.pathsuffix");                 // -> /FHIR/R4/DocumentReference
target_pathsuffix   = proxy_pathsuffix.replace("/FHIR/R4", "/production");    // -> /production/DocumentReference

// If we don't set this then it will add the "/FHIR/R4/DocumentReference"
context.setVariable("target.copy.pathsuffix", false);
// Write the new path into the variable 'target_path'
context.setVariable("target_path", target_pathsuffix);
