var Client = require("ibmiotf");
var appClientConfig = require("./application.json");

var appClient = new Client.IotfApplication(appClientConfig);

var connection = appClient.connect();
console.log(connection);

appClient.on("connect", function () {
  console.log(appClientConfig);
  /*setInterval(function function_name () {
    appClient.publish('temp', 'json', '{"hum":' + 6 +'}');
  },2000);*/
});