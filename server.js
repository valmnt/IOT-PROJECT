var Client = require("ibmiotf");
var appClientConfig = require("./application.json");

var appClient = new Client.IotfApplication(appClientConfig);

appClient.connect();

appClient.on("connect", function () {

  /*var myData={'name' : 'foo', 'cpu' : 60, 'mem' : 50};
  myData = JSON.stringify(myData);
  appClient.publishDeviceEvent("DTC","iot-project", "temp", "json", myData);*/

  appClient.subscribeToDeviceEvents("DTC","iot-project","+","json");
});

appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
 
  console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);

});