import { JoyStick } from "./joy.js"

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

setInterval(() => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          displayArcadeText(this.responseText);
        }
      };
    xhttp.open("GET", "/info", true);
    xhttp.send();
}, 1000);