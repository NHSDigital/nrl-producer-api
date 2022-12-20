/*
 * This script reads a Custom Attribute from the APIGEE app and sends it to the API
 * as the `NHSD-Connection-Metadata` header.
 * 
 * The Http Header 'NHSD-End-User-Organisation-ODS' is expected.
 * The Custom Attribute `nrl-ods-<ods_code>` is transformed from:
 * 
 * e.g.
 * 
 * HTTP Request Header          = ods_code: RJ11
 * APIGEE App Custom Attribute  = nrl-ods-RJ11: https://snomed.info/ict|736253001\nhttps://snomed.info/ict|736253002\n
 * 
 * Http Response Header = NHSD-Connection-Metadata: 
 *  {
 *      "nrl.ods-code": "RJ11",
 *      "nrl.pointer-types": [
 *          "https://snomed.info/ict|736253001",
 *          "https://snomed.info/ict|736253002"
 *      ]
 *  }
 */

(function(){
    // Read the 'NHSD-End-User-Organisation-ODS' header
    var odsCode = context.getVariable('request.header.NHSD-End-User-Organisation-ODS');
    if (!odsCode || odsCode.trim().length === 0) {
        context.setVariable("badRequest", true);
        return;
    }

    // Read the associated `nrl-ods-<ods_code>` custom attribute from the APIGEE app
    var nrlPointerTypes = context.getVariable('app.nrl-ods-' + odsCode);
    if (!nrlPointerTypes || nrlPointerTypes.trim().length === 0) {
        context.setVariable("forbidden", true);
        return;
    }

    // Convert it into a complex object
    var lines = nrlPointerTypes.split('\n');
    var pointerTypes = [];
    for (var i=0;i<lines.length;i++) {
        var line = lines[i];
        if (line && line.trim().length !== 0) {
            pointerTypes.push(line);
        }
    }

    // Build the response
    var connectionMetadata = {
        "nrl.ods-code": odsCode,
        "nrl.pointer-types": pointerTypes,
    };
    context.targetRequest.headers['NHSD-Connection-Metadata'] = connectionMetadata;
})();
