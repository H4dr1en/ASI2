'use strict';

const fs = require("fs");
const path = require("path");
const util = require('util');
var utils = require("../utils/utils");
var CONFIG = JSON.parse(process.env.CONFIG);

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const rename = util.promisify(fs.rename);

var ContentModel = require("./../models/content.model");

module.export = this;

this.getContents = function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    // Loop through all the files in the temp directory
    readdir(CONFIG.contentDirectory).then(files => {
        let promises = [];

        files.forEach(file => {
            if (!utils.isJSON(file)) return;
            promises.push(readFile(path.join(CONFIG.contentDirectory, file), 'utf8'));
        })

        let result = [];

        Promise.all(promises).then(values => {
            values.forEach(el => result.push(JSON.parse(el)));
            res.end(JSON.stringify(result));
        }).catch(error => res.status(500).end(error.message));

    }, error => res.status(500).end(error.message));
}

this.getContent = function (req, res) {
    ContentModel.read(req.id)
        .then(content => res.end(JSON.stringify(content)))
        .catch(err => res.status(500).end(err.message))
}

this.create = function (req, res) {
    console.log(req.file)
    console.log(req.body)

    let content = new ContentModel({ type: req.body.type, src: req.body.src, title: req.body.title });

    let destPath = path.join(CONFIG.contentDirectory, content.id + path.extname(req.file.originalname));

    let p = Promise.resolve();

    if (req.body.type == "img") {
        let fileName = content.id + path.extname(req.file.originalname);
        content.src = path.join("/content/", content.id);
        content.fileName = fileName;
        p = rename(req.file.path, destPath);
    }
    else {
        content.src = path.join("/content", req.body.src);
    }
    
    p.then(() => ContentModel.create(content))
        .then(() => res.end())
        .catch(e => res.status(500).end(e.message));
}