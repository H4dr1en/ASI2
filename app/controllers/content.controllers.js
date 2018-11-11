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

this.list = function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    // Loop through all the files in the temp directory
    readdir(CONFIG.contentDirectory).then(files => {
        let promises = [];

        files.forEach(file => {
            if (!utils.isJSON(file)) return;
            promises.push(readFile(path.join(CONFIG.contentDirectory, file), 'utf8'));
        })

        let result = {};

        return Promise.all(promises).then(values => {
            values.forEach(el => {
                let obj = JSON.parse(el);
                result[obj.id] = obj;
            });
            res.end(JSON.stringify(result));
        })
    })
    .catch(error => res.status(500).end(error.message));
}

this.read = function (req, res) {
    ContentModel.read(req.id)
        .then(content => {
            if(req.param('json')) {
                return res.end(JSON.stringify(content));            
            } 
            
            if(content.type == "img") {
                return res.sendFile(path.join(CONFIG.contentDirectory, content.fileName));
            }

            return res.redirect(content.src);                     
        })
        .catch(err => res.status(500).end(err.message))
}

this.create = function (req, res) {
    console.log(req.file)
    console.log(req.body)

    if(['img', 'img_url', 'video', 'web'].indexOf(req.body.type) == -1)
        return res.status(500).end(`Type: ${req.body.type} is not supported`)

    let content = new ContentModel({ type: req.body.type, src: req.body.src, title: req.body.title });

    let p = Promise.resolve();

    if (req.body.type == "img") {

        if(!req.file) {
            return res.status(500).end("No file provided for type image")
        }

        content.src = path.join("/content/", content.id);
        content.fileName = content.id + path.extname(req.file.originalname);
        
        let destPath = path.join(CONFIG.contentDirectory, content.id + path.extname(req.file.originalname));
        p = rename(req.file.path, destPath);

    } else {

        if(!req.body.src)
            return res.status(500).end(`No src provided for type: ${req.body.type}`)
        else
            content.src = req.body.src;
    }
    
    p.then(() => ContentModel.create(content))
        .then(() => res.type('json').json({'uuid':content.id}))
        .catch(e => res.status(500).end(e.message));
}