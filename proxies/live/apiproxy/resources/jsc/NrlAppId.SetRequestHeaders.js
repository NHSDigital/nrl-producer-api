(function () {
  const nrlAppID = context.getVariable("app.nrl-app-id");
  if (nrlAppID) {
    context.targetRequest.headers["NHSD-NRL-App-ID"] = nrlAppID;
  }
})();
