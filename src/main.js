import { Value } from "three/examples/jsm/inspector/ui/Values.js";
import "./style.css";

/* const ws = new WebSocket("ws://224.0.0.1:8080");

window.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("#playBtn");

  let value = 0;

  button.disabled = true;

  ws.addEventListener("open", () => {
    console.log("Connected to Chataigne");
    button.disabled = false;
  });

  ws.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.addEventListener("close", () => {
    console.log("WebSocket closed");
    button.disabled = true;
  });

  button.addEventListener("click", () => {
    value = value === 0 ? 1 : 0;

    ws.send(`/modules/webSocketServer/values/number ${value}`);

    console.log(`MyValue1 = ${value}`);
  });
}); */
