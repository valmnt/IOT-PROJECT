const Client = require("ibmiotf");
const express = require('express');
const bodyParser = require("body-parser");
const session = require('express-session');
const connection = require('./src/js/connection');
const app = express();

app.use(session({ resave: true, secret: '123456', saveUninitialized: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var appClientConfig = require("./application.json");

var appClient = new Client.IotfApplication(appClientConfig);

appClient.connect();

appClient.on("connect", function () {

  /*var myData={'name' : 'foo', 'cpu' : 60, 'mem' : 50};
  myData = JSON.stringify(myData);
  appClient.publishDeviceEvent("DTC","iot-project", "temp", "json", myData);*/

  appClient.subscribeToDeviceEvents("DTC", "iot-project", "+", "json");
});

appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {

  console.log("Device Event from :: " + deviceType + " : " + deviceId + " of event " + eventType + " with payload : " + payload);

});

app.get('/', function (req, res) {
  res.render('index.ejs');
})

app.get('/login', function (req, res) {
  res.render('login.ejs');
})

app.get('/dashboard', (req, res) => {
  console.log(req.session.username)
  res.render('dashboard.ejs');
})


app.post('/connection', function (req, res) {
  connection.connect(req, res)
})

app.listen(3000);