export default async function sendAction(){

osc.open();


  var message = new OSC.Message("/trigger");
 await osc.send(message);

}