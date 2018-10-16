var express = require("express");
var fs = require('fs');
var path = require('path');
const util = require('util');
var router = express.Router();
module.exports = router;

var utils = require("../utils/utils");
var CONFIG = JSON.parse(process.env.CONFIG);

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

router.route("/loadPres")
    .get(function (request, response) {
        response.setHeader('Content-Type', 'application/json');

        // Loop through all the files in the temp directory
        readdir(CONFIG.presentationDirectory).then(files => {
            let promises = [];

            files.forEach(file => {
                if (!utils.isJSON(file))
                    return;

                promises.push(readFile(path.join(CONFIG.presentationDirectory, file), 'utf8'));
            })

            let result = {};

            Promise.all(promises).then(values => {
                values.forEach(el => {
                    let obj = JSON.parse(el);
                    result[obj.id] = obj;
                });
                response.send(result);
            }).catch(err => console.log(err));

        }, err => {
            console.error("Could not list the directory.", err);
            process.exit(1);
        });
    })
    .post(function (request, response) {

    })
    .put(function (request, response) {

    })
    .delete(function (request, response) {

    })
    .all(function (request, response) {

    })



router.route("/SavePres")
    .get(function (request, response) {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.send("Must be post");
    })
    .post(function (request, response) {

        var body = "";

        request.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });

        request.on('end', () => {
            let pres = JSON.parse(body);

            // if(utils.fileExists(path.join(CONFIG.presentationDirectory)))
            let file = utils.getPresFilePath(pres.id);
            writeFile(file, JSON.stringify(pres)).then(res => {
                response.status(200);
                response.end();
            }).catch(err => {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end(err.message);
            })
        });
    })
    .put(function (request, response) {

    })
    .delete(function (request, response) {

    })
    .all(function (request, response) {

    })