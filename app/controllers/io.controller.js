var utils = require("../utils/utils");
var CONFIG = JSON.parse(process.env.CONFIG);
var ContentModel = require("./../models/content.model");

module.export = this;

this.listen = function (server) {

    var io = require('socket.io')(server);

    let map = new Map();

    io.on('connection', socket => {
        socket.emit("connection", {});
        socket.on('data_comm', data => {

            map.set(data.id, socket)

            socket.on('slidEvent', (dataEvent) => {

                if (!dataEvent.slid) {
                    return socket.emit("slideEvent_back", { error: "No slid provided" });
                }

                if (!utils.isUUID(dataEvent.slid.id)) {
                    return socket.emit("slideEvent_back", { error: "Incorrect UUID" });
                }
                map.forEach(socket => {
                    socket.emit("currentSlidEvent", { "slid": dataEvent.slid })
                });
            })
        });

        socket.on('disconnect', () => map.delete(socket.id));
    });
}

