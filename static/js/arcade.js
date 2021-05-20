import { JoyStick } from "./joy.js"
import { uniqueId } from "./utils.js"
import { CONFIG } from "./config.js"

var socket = io();
socket.on('connect', function () {
  socket.emit('command', { player: playerID, event: "connect" });
});

const stick = new JoyStick('stick');

let playerID = 0;
// Storing unique ID for a cookie
window.onload = () => {
  if (!document.cookie) {
    playerID = uniqueId();
    document.cookie = `player=${playerID}`;
    return;
  }
  let cookies = decodeURIComponent(document.cookie).split(';');
  const cookiesObj = {};
  cookies.forEach((c) => {
    const kv = c.split('=');
    cookiesObj[kv[0]] = kv[1];
  })
  playerID = cookiesObj.player;
}

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

// Emitting Command events
document.addEventListener("command", (ev) => {
  const command = {
    ...ev.detail.command,
    player: playerID
  };
  socket.emit("command", command);
})

// Updating Led Display
setInterval(() => {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (this.responseText == "") {
        return;
      }
      displayArcadeText(this.responseText);
    }
  };
  xhttp.open("GET", "/info", true);
  xhttp.send();
}, CONFIG.display_refresh_ms);
