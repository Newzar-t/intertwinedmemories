import OSC from "osc-js";

const osc = new OSC();

osc.open({ host: "10.137.96.225", port: 8080 });

export default function sendAction(msgSend) {
  var message = new OSC.Message(msgSend);
  osc.send(message);
}
