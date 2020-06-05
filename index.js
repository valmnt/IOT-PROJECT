/*var mqtt = require("mqtt");

var client = mqtt.connect(
    "mqtt://7q1q1p.messaging.internetofthings.ibmcloud.com",
    (options = {
        clientId: "A:7q1q1p:DTC:iot-project",
        username: "a-7q1q1p-3y6xqarcyl",
        password: "&_lHGw?qA(OR5ubnKe",
        clean: true,
    })
);

client.on("connect", function () {
    console.log("connected" + client.connected);
});

client.end();*/

var Client = require("ibmiotf");
var appClientConfig = require("./application.json");

var appClient = new Client.IotfApplication(appClientConfig);

appClient.connect();

appClient.on("connect", function () {
  console.log("connected");
});