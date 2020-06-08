const Client = require("ibmiotf");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const login = require("./src/js/login");
const app = express();

var appClientConfig = require("./application.json");

var appClient = new Client.IotfApplication(appClientConfig);

app.use(session({ resave: true, secret: "123456", saveUninitialized: true }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", function (req, res) {
  res.render("index.ejs");
});

app.get("/login", function (req, res) {
  res.render("login.ejs");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard.ejs", {
    device: req.session.device,
    status: session.status,
    role: req.session.role,
  });
});

app.post("/connection", function (req, res) {
  login.connect(req, res);
});

app.get("/successCreate", function (req, res) {
  res.render("successCreate.ejs");
});

app.get("/addDevice", function (req, res) {
  if (req.session.device === 0) {
    const addDevice = require("./src/js/add_device");
    addDevice.creationDevice(req.session.username);
    res.redirect("/successCreate");
  } else {
    console.log(req.session.device);
    res.redirect("/dashboard");
  }
});

app.get('/statusChange', function(req, res) {

appClient.connect();

appClient.on("connect", function () {
  var myData = { state: "healthy", temp: 37 };
  session.status = "en bonne santé";
  myData = JSON.stringify(myData);
  appClient.publishDeviceEvent("DTC", req.session.username, "status", "json", myData);

  appClient.subscribeToDeviceEvents("DTC", 'iot-project', "status", "json");
});

appClient.on("deviceEvent", function (
  deviceType,
  deviceId,
  eventType,
  format,
  payload
) {
  console.log(
    "Device Event from :: " +
      deviceType +
      " : " +
      deviceId +
      " of event " +
      eventType +
      " with payload : " +
      payload
  );
  payloadObject = JSON.parse(payload.toString());
 
  if (payloadObject.status === "sick") {
    appClient.publishDeviceEvent("DTC", req.session.username, "status", "json", {
      state: "suspect",
    });
    session.status = "suspect";
  }
})
  res.redirect('/dashboard');
})

app.get('/confirmSick', function(req, res) {
  appClient.connect();

  appClient.on("connect", function() {
    var myData={'status' : 'malade'};
    myData = JSON.stringify(myData);
    appClient.publishDeviceEvent("DTC","val", "status", "json", myData);
})
  res.redirect('/dashboard')
})

app.get('/medecinInfo', function(req, res) {
 appClient.connect();

 appClient.on("connect", function() {
  appClient.subscribeToDeviceEvents("DTC", req.session.username, "status", "json")
 })
 
 appClient.on("deviceEvent", function (
  deviceType,
  deviceId,
  eventType,
  format,
  payload
) {
  console.log(
    "Device Event from :: " +
      deviceType +
      " : " +
      deviceId +
      " of event " +
      eventType +
      " with payload : " +
      payload
  )
  payloadObject = JSON.parse(payload.toString());
if (payloadObject.status === "malade") {
  appClient.publishDeviceEvent("DTC", req.session.username, "status", "json", {
    state: "malade",
  });
  session.status = "malade";
}
});

res.redirect('/dashboard')
})
  

app.listen(3000);
