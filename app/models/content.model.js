const util = require('util');
var utils = require("../utils/utils");
var CONFIG = JSON.parse(process.env.CONFIG);

const path = require("path");

var fs = require('fs');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const removeFile = util.promisify(fs.unlink);

module.exports = class ContentModel {

    constructor({ type = null, id = utils.generateUUID(), title = null, src = null, fileName = null } = {}) {
        this.type = type
        this.id = id;
        this.title = title;
        this.src = src;
        this.fileName = fileName;

        // private _data
        var _data = null;
        this.getData = () => _data;
        this.setData = (value) => { _data = value };
    }

    // callback(err)
    static create(content, callback) {

        if (!content instanceof ContentModel) {
            return callback(new Error("Content is not of type ContentMode"));
        }

        if (!utils.isUUID(content.id)) {
            return callback(new Error("Incorrect id"));
        }

        let p1 = Promise.resolve();

        if (content.getData()) {
            p1 = writeFile(utils.getDataFilePath(content.fileName), content.getData());
        }

        let p2 = writeFile(utils.getMetaFilePath(content.id), JSON.stringify(content));

        Promise.all([p1, p2])
            .then(() => callback()) // Can't do then(callback) because Promise.all returns an array of resolved values, empty here
            .catch(err => {
                console.log("Error writing file: ", err);
                callback(err);
            });
    }

    // callback(err, data)
    static read(id, callback) {

        if (!utils.isUUID(id)) {
            return callback(new Error("Incorrect id"));
        }

        readFile(utils.getMetaFilePath(id), 'utf8')
            .then(data => callback(undefined, new ContentModel(JSON.parse(data))))
            .catch(err => {
                console.error("Error writing file: ", err);
                callback(err);
            })
    }

    // callback(err)
    static update(content, callback) {

        if (!content instanceof ContentModel) {
            return callback(new Error("Content is not of type ContentMode"));
        }

        if (!utils.isUUID(content.id)) {
            return callback(new Error("Incorrect id"));
        }

        let p2 = Promise.resolve();

        let p1 = writeFile(utils.getMetaFilePath(content.id), JSON.stringify(content))

        let data = content.getData();

        if (content.getData()) {
            p2 = writeFile(utils.getDataFilePath(content.fileName), data)
        }

        Promise.all([p1, p2])
            .then(() => callback()) // Can't do then(callback) because Promise.all returns an array of resolved values, empty here
            .catch(err => {
                console.error("Error writing file: ", err);
                callback(err);
            });
    }

    static delete(id, callback) {

        if (!utils.isUUID(id)) {
            return callback(new Error("Incorrect id"));
        }

        let p1 = readFile(utils.getMetaFilePath(id)).then(data => removeFile(utils.getDataFilePath(JSON.parse(data).fileName)));
        let p2 = removeFile(utils.getMetaFilePath(id));

        Promise.all([p1, p2])
            .then(() => callback()) // Can't do then(callback) because Promise.all returns an array of resolved values, empty here
            .catch(err => {
                console.error("Error reading/writing file: ", err);
                callback(err);
            });
    }
}