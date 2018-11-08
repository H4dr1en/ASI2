var express = require("express");
var router = express.Router();

var utils = require("../utils/utils");

module.exports = router;

router.route("/uuid")
    .get((req, res) => res.end(utils.generateUUID()));