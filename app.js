var CONFIG = require("./config.json");
const path = require("path");

CONFIG.contentDirectory = path.join(process.env.PWD, CONFIG.contentDirectory);
CONFIG.presentationDirectory = path.join(process.env.PWD, CONFIG.presentationDirectory);
CONFIG.tmpDirectory = path.join(process.env.PWD, CONFIG.tmpDirectory);

process.env.CONFIG = JSON.stringify(CONFIG);
// var CONFIG = JSON.parse(process.env.CONFIG);

var express = require("express");
var app = express();
var http = require("http");

var defaultRoute = require("./app/routes/default.route.js");
var presRoute = require("./app/routes/presentation.route.js");
var contentRoute = require("./app/routes/content.route.js");

app.use([defaultRoute, presRoute, contentRoute]);

// init server
var server = http.createServer(app);
server.listen(CONFIG.port);

app.use("/admin", express.static(path.join(__dirname, "public/admin")));
app.use("/watch", express.static(path.join(__dirname, "public/watch")));