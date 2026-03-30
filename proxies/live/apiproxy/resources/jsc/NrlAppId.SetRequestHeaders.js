(function () {
  const nrlAppID = context.getVariable("app.nrl-app-id");
  if (nrlAppID) {
    context.targetRequest.headers["X-Proxygen-App-NRL-App-ID"] = nrlAppID;
  } else {
    context.targetRequest.headers["X-Proxygen-App-NRL-App-ID"] = "NotProvided";
  }
})();
