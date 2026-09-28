import { Value } from "three/examples/jsm/inspector/ui/Values.js";
import "./style.css";
import OSC from "osc-js";

const osc = new OSC();

function main() {
  osc.open({ host: "10.137.97.204", port: 8080 });

  function test() {
    osc.on;
  }

  document.body.addEventListener("click", test);
}

main();
