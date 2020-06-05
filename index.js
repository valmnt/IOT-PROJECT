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
var appClientConfig = 
    {
        "org": "7q1q1p",
        "id": "iot-project",
        "auth-key": "a-7q1q1p-ziuj6dn3ci",
        "auth-token": "YeboYWvn7Z*DUfYsoM",
      }


var appClient = new Client.IotfApplication(appClientConfig);

var connection = appClient.connect();

appClient.on("connect", function () {
  console.log(connection);
});

appClient.on("temp", function () {
    console.log("temp");
  });
