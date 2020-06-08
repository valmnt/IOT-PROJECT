const Base64 = require("js-base64").Base64;
const axios = require("axios");
const bdd = require("./bdd_connect");

const username = "a-53zlq7-6akarfqxsv";
const password = "qBRBy21iIGPoTyQ3*o";
const dtc = "DTC";

function creationDevice(user) {
  axios({
    method: "post",
    url: `https://53zlq7.internetofthings.ibmcloud.com/api/v0002/device/types/${dtc}/devices`,
    headers: {
      Authorization: `Basic ${Base64.encode(`${username}:${password}`)}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {
      deviceId: user,
      authToken: "ooooooooooooooooooooooooooooo",
      deviceInfo: {
        serialNumber: "string",
        manufacturer: "string",
        model: "string",
        deviceClass: "string",
        description: "string",
        fwVersion: "string",
        hwVersion: "string",
        descriptiveLocation: "string",
      },
      location: {
        longitude: 0,
        latitude: 0,
        elevation: 0,
        accuracy: 0,
        measuredDateTime: "2020-06-05T20:08:07.894Z",
      },
      metadata: {},
    },
  });

  var connection = bdd.connectBdd();
  connection.connect();

  var sql = "UPDATE users SET device = '1' WHERE username = '" + user + "'";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
}
module.exports = {
  creationDevice,
};
