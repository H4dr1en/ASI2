var express = require("express");
var router = express.Router();
module.exports = router;


router.route("/")
    .get(function (request, response) {
        response.writeHead(200,{'Content-Type': 'text/plain'});
        response.end("OK");
    
    })
    .post(function (request, response) {

    })
    .put(function (request, response) {

    })
    .delete(function (request, response) {

    })
    .all(function (request, response) {

    })