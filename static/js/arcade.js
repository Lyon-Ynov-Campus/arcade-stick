import { JoyStick } from "./joy.js"

var socket = io();
socket.on('connect', function() {
    socket.emit('command', {data: 'Socket connection OK'});
});

const stick = new JoyStick('stick');

function displayArcadeText(text) {
    const led = document.getElementById("led-display");

    // Clear if full
    if (led.childNodes.length == 3) {
        led.removeChild(led.childNodes[0]);
    }

    const p = document.createElement("p");
    p.innerHTML = text;
    led.appendChild(p);
    led.scrollTop = led.scrollHeight - led.clientHeight;
}

document.addEventListener("command", (ev) => {
  socket.emit("command", ev.detail.command);
})

setInterval(() => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          if (this.responseText == "") {
            return;
          }
          displayArcadeText(this.responseText);
        }
      };
    xhttp.open("GET", "/info", true);
    xhttp.send();
}, 200);