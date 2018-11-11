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

            socket.on('slideEvent', slid => {

                if (!utils.isUUID(slid.id)) {
                    return socket.emit("slideEvent_back", { error: "Incorrect UUID" });
                }

                if (!slid.id) {
                    return socket.emit("slideEvent_back", { error: "No slid provided" });
                }
                
                ContentModel.read(slid.id).then(content => {
                    map.forEach(socket => {
                        console.log(`sending currentSlidEvent to ${socket.id}`)
                        socket.emit("currentSlidEvent", { "slide": content })
                        console.log("sending slide", content)
                    });
                }).catch(console.log)

                // TODO : broadcast
            })
        });

        socket.on('disconnect', () => map.delete(socket.id));
    });
}

