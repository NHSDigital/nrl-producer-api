(function () {
  const nrlAppID = context.getVariable("app.nrl-app-id");
  if (!nrlAppID || nrlAppID.trim().length === 0) {
    //This will trigger RaiseFault.403MissingNRLAppID.xml - see targets/targets.xml
    return;
  }

  context.targetRequest.headers["NHSD-NRL-App-ID"] = nrlAppID;
})();
