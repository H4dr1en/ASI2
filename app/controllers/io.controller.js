var utils = require("../utils/utils");
var CONFIG = JSON.parse(process.env.CONFIG);
var ContentModel = require("./../models/content.model");

module.export = this;

this.listen = function (server) {

    var io = require('socket.io')(server);

    let map = new Map();

    io.on('connection', socket => {
        console.log("user connected")
        socket.emit("connection", {});
        socket.on('data_comm', data => {

            map.set(data.id, socket)

            socket.on('slideEvent', data => {

                if (!utils.isUUID(data.SLID_ID)) {
                    return socket.emit("slideEvent_back", { error: "Incorrect UUID" });
                }

                if (['START', 'END', 'BEGIN', 'PREV', 'NEXT'].indexOf(data.CMD) == -1) {
                    return socket.emit("slideEvent_back", { error: "Incorrect command" });
                }
                
                ContentModel.read(data.SLID_ID).then(content => {
                    map.forEach(socket => {
                        console.log(`sending currentSlidEvent to ${socket.id}`)
                        socket.emit("currentSlidEvent", { "slide": content })
                    });
                }).catch(console.log)

                // TODO : broadcast
            })
        });

        socket.on('disconnect', () => map.delete(socket.id));
    });
}

