var utils = require("../utils/utils");
var CONFIG = JSON.parse(process.env.CONFIG);
var ContentModel = require("./../models/content.model");

module.export = this;

this.listen = function (server) {

    var io = require('socket.io')(server);

    let map = new Map();

    io.on('connection', socket => { 
        socket.emit("connection", {});       
        socket.on('data_comm', data => map.set(data.id, socket))
        socket.on('slideEvent', data => {

            if (utils.isUUID(data.slideID)) {
                return socket.emit("slideEvent_back", { error: "Incorrect UUID" });
            }

            if (['START', 'END', 'BEGIN', 'PREV', 'NEXT'].indexOf(data.CMD) == -1) {
                return socket.emit("slideEvent_back", { error: "Incorrect command" });
            }

            map.forEach(socket => socket.emit("changeSlide", { slideID: data.slideID}));
        })
    });
}

