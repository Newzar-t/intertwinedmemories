////

Code for node serv bridge => 

const OSC = require('osc-js');

const config = {
wsServer:{ host : "0.0.0.0", port: 8080 },
updClient: { host: "127.0.0.1", port : 11000},
}

const osc = new OSC({plugin: new OSC.BridgePlugin(config)})

osc.open()
