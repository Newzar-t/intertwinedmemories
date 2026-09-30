import OSC from "osc-js";

const osc = new OSC();

window.addEventListener("DOMContentLoaded", () => {
  osc.open({ host: "10.137.97.204", port: 8080 });
});

export default function sendAction() {
  var message = new OSC.Message("/playHello");
  osc.send(message);
  console.log(message);
}
