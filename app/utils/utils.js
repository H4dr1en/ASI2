'use strict';

var fs = require("fs");
var path = require("path");
var CONFIG = JSON.parse(process.env.CONFIG);

module.exports = this;

this.generateUUID = function () {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
};

this.checkUUID = function(uuid) {
    let regex = RegExp("([0-9a-zA-Z]){8}-([0-9a-zA-Z]){4}-4([0-9a-zA-Z]){3}-([0-9a-zA-Z]){4}-([0-9a-zA-Z]){12}");
    return regex.test(uuid);
}

this.fileExists = function (path, callback) {
	fs.stat(path, function (err, stat) {
		if (err) {
			callback(err);
		} else {
			if (stat.isFile()) {
				callback(null);
			}
		}
	});
};

this.readFileIfExists = function (path, callback) {
	this.fileExists(path, function (err) {
		if (err) {
			callback(err);
		} else {
			fs.readFile(path, callback);
		}
	});
};

this.getMetaFilePath = function (id) {
	return path.join(CONFIG.contentDirectory, id + ".meta.json");
};

this.getPresFilePath = function (id) {
	return path.join(CONFIG.presentationDirectory, id + ".pres.json");
};

this.getDataFilePath = function (fileName) {
	return path.join(CONFIG.contentDirectory, fileName);
};

this.getNewFileName = function (id, originalFileName) {
	return id + '.' + originalFileName.split('.').pop();
};

this.getFileId = function (filename) {
	return path.basename(filename);
}

this.isJSON = function (filename) {
	return path.extname(filename).toLocaleLowerCase() == ".json";
}
