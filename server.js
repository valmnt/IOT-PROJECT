const Client = require("ibmiotf");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const login = require("./src/js/login");
const app = express();

app.use(session({ resave: true, secret: "123456", saveUninitialized: true }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

var appClientConfig = require("./application.json");

var appClient = new Client.IotfApplication(appClientConfig);

function start (role) {
  appClient.connect();
if (role === 'user') {

  appClient.on("connect", function () {
    appClient.subscribeToDeviceEvents("DTC", 'val', "status", "json")
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
   
    if (payloadObject.status === "sick" && session.status !== 'malade') {
      appClient.publishDeviceEvent("DTC", 'val', "status", "json", {
        state: "suspect",
      });
      session.status = "suspect";
    }
    if (payloadObject.status === "malade") {
      appClient.publishDeviceEvent("DTC", 'val', "status", "json", {
        state: "malade",
      });
      session.status = "malade";
    }
  })
}
else if(role === 'medecin') {
  appClient.on("connect", function () {
    appClient.subscribeToDeviceEvents("DTC", 'val', "temp", "json")
  });

  appClient.on("deviceEvent", function (
    deviceType,
    deviceId,
    eventType,
    format,
    payload
  ) {
    console.log(payload.toString())
    session.payload = payload.toString();
})
}
}
app.get("/", function (req, res) {
  res.render("index.ejs");
});

app.get("/login", function (req, res) {
  res.render("login.ejs");
});

app.get("/dashboard", (req, res) => {
  console.log(session.payload)
  start(session.role)
  res.render("dashboard.ejs", {
    isPublished: req.session.isPublished,
    device: req.session.device,
    status: session.status,
    role: req.session.role,
    payload: session.payload
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

app.get('/confirmSick', function(req, res) {
  appClient.connect();

  appClient.on("connect", function() {
    var myData={'status' : 'malade'};
    myData = JSON.stringify(myData);
    appClient.publishDeviceEvent("DTC","val", "status", "json", myData);
})
  res.redirect('/dashboard')
})

app.post("/publishTemp", function (req, res) {
  appClient.connect();

  appClient.on("connect", function() {
    appClient.publishDeviceEvent("DTC", req.session.username, "temp", "json", {
      user: req.session.username,
      temp: req.body.temp,
    });
  })
  req.session.isPublished = true;
  res.redirect("/dashboard");
});

app.listen(3000);
