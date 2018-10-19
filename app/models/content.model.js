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

        let p1 = p2 = Promise.resolve();

        if (content.type !== "img") {   // TODO: understand
            p1 = push(writeFile(utils.getDataFilePath(content.fileName), content.getData())
                .catch(err => console.log("Error writing file: ", err)));
        }

        p2 = push(writeFile(utils.getMetaFilePath(content.id), JSON.stringify(content))
            .catch(err => console.log("Error writing file: ", err)));

        // Can't do then(callback) because Promise.all returns an array of the resolved values that is empty here
        Promise.all([p1,p2]).then(() => callback(), callback); // Error handling is done in each promise
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

        let p1 = p2 = Promise.resolve();

        p1 = writeFile(utils.getMetaFilePath(content.id), JSON.stringify(content))
            .catch(err => console.log("Error writing file: ", err));

        if (content.type !== "img" && content.getData() && content.getData().length) {
            p2 = writeFile(utils.getDataFilePath(content.fileName), content.getData())
                .catch(err => console.log("Error writing file: ", err));
        }

        Promise.all([p1,p2]).then(() => callback(), callback); // Error handling is done in each promise
    }

    static delete(id, callback) {

        let p1 = p2 = Promise.resolve();

        p1 = readFile(utils.getMetaFilePath(id))
            .then(data => removeFile(utils.getDataFilePath(JSON.parse(data).fileName))
            .catch(err => console.log("Error reading/writing file: ", err)));

        p2 = removeFile(utils.getMetaFilePath(id)).catch(err => console.log("Error writing file: ", err));

        Promise.all([p1,p2]).then(() => callback(), callback); // Error handling is done in each promise
    }
}