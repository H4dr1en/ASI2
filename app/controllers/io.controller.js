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

            console.log("connection established")

            map.set(data.id, socket)

            socket.on('slideEvent', slid => {

                console.log("recieved", slid)

                if (!slid) {
                    return socket.emit("slideEvent_back", { error: "No slid provided" });
                }

                if (!utils.isUUID(slid.id)) {
                    return socket.emit("slideEvent_back", { error: "Incorrect UUID" });
                }
                
                map.forEach(socket => {
                    console.log(`sending currentSlidEvent to ${socket.id}`)
                    socket.emit("currentSlidEvent", { "slide": slid })
                    console.log("sending slide", slid);
                });
                //ContentModel.read(slid.id).then(content => {                   
                //}).catch(console.log)

                // TODO : broadcast
            })
        });

        socket.on('disconnect', () => map.delete(socket.id));
    });
}

