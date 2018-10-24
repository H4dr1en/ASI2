var express = require("express");
var router = express.Router();
module.exports = router;

var loginController = require('../controllers/content.controllers');

router.route("/login")
    .post(loginController.login)