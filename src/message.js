import OSC from "osc-js";

const osc = new OSC();

osc.open({ host: "10.137.98.221", port: 8080 });

export default function sendAction(msgSend, msgSound) {
  var message = new OSC.Message(msgSend);
  var sound = new OSC.Message(msgSound);
  osc.send(message);
  console.log(message);
}
