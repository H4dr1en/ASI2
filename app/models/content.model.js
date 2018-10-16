const util = require('util');
var utils = require("../utils/utils");
var CONFIG = JSON.parse(process.env.CONFIG);

const path = require("path");

var fs = require('fs');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const removeFile = util.promisify(fs.unlink);

module.exports = class ContentModel {

    constructor({ type = null, id = null, title = null, src = null, fileName = null } = {}) {
        this.type = type
        this.id = id;
        this.title = title;
        this.src = src;
        this.fileName = fileName;
        this._data = null;
    }

    getData() { return this._data };
    setData(value) { this._data = value };

    // callback(err)
    static create(content, callback) {

        if (!content instanceof ContentModel)
            console.log("Warning: content is not of type ContentMode");

        let promises = [];

        if (content.type !== "img") {   // TODO: understand
            promises.push(writeFile(utils.getDataFilePath(content.fileName), content.getData())
                .catch(err => console.log("Error writing file: ", err)));
        }

        promises.push(writeFile(utils.getMetaFilePath(content.id), JSON.stringify(content))
            .catch(err => console.log("Error writing file: ", err)));

        Promise.all(promises).then(() => callback(), callback); // Error handling is done in each promise
    }

    // callback(err, data)
    static read(id, callback) {

        readFile(utils.getMetaFilePath(id), 'utf8')
            .then(data => callback(undefined, new ContentModel(JSON.parse(data))))
            .catch(err => {
                console.log("Error writing file: ", err);
                callback(err);
            })
    }

    // callback(err)
    static update(content, callback) {
        if (!content instanceof ContentModel)
            console.log("Warning: content is not of type ContentMode");

        let promises = [];

        promises.push(writeFile(utils.getMetaFilePath(content.id), JSON.stringify(content)).catch(err =>
            console.log("Error writing file: ", err)));

        if (content.type !== "img" && content.getData() && content.getData().length) {
            promises.push(writeFile(utils.getDataFilePath(content.fileName), content.getData())
                .catch(err => console.log("Error writing file: ", err)));
        }

        Promise.all(promises).then(() => callback(), callback); // Error handling is done in each promise
    }

    static delete(id, callback) {

        let promises = [];

        promises.push(readFile(utils.getMetaFilePath(id))
            .then(data => removeFile(utils.getDataFilePath(JSON.parse(data).fileName))
            .catch(err => console.log("Error reading/writing file: ", err))));

        promises.push(removeFile(utils.getMetaFilePath(id)).catch(err => console.log("Error writing file: ", err)));

        Promise.all(promises).then(() => callback(), callback); // Error handling is done in each promise
    }
}