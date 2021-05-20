import { CONFIG } from "./config.js"

export class JoyStick {
  constructor(container, parameters = {}) {
    this.style = {
      title: "joystick",
      internalFillColor: "#bf0232",
      internalLineWidth: 1,
      internalStrokeColor: "#111",
      externalLineWidth: "5",
      externalStrokeColor: "#111",
      autoReturnToCenter: true,
      ...parameters.style,
    };

    // Create Canvas element and add it in the Container object
    var objContainer = document.getElementById(container);
    this.canvas = document.createElement("canvas");
    this.canvas.id = this.style.title;

    if (!this.style.width) {
      this.style.width = objContainer.clientWidth;
    }
    if (!this.style.height) {
      this.style.height = objContainer.clientHeight;
    }

    this.canvas.width = this.style?.width;
    this.canvas.height = this.style?.height;

    objContainer.appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");

    this.status = {
      pressed: false,
      position: this.center,
      last: Date.now(),
    };
    this.registerEvents();
    if (CONFIG.joystick_mode === "UPDATE") {
      this.listenStick();
    }
    // Draw the object
    this.drawExternal();
    this.drawInternal();
  }

  listenStick() {
    setInterval(() => {
      this.sendCommand({ stick: this.direction });
    }, CONFIG.joystick_update_ms);
  }

  registerEvents() {
    // Check if the device support the touch or not
    if ("ontouchstart" in document.documentElement) {
      this.canvas.addEventListener(
        "touchstart",
        (ev) => {
          this.onTouchStart(ev);
        },
        false
      );
      this.canvas.addEventListener(
        "touchmove",
        (ev) => {
          this.onTouchMove(ev);
        },
        false
      );
      this.canvas.addEventListener(
        "touchend",
        (ev) => {
          this.onTouchEnd(ev);
        },
        false
      );
    } else {
      this.canvas.addEventListener(
        "mousedown",
        (ev) => {
          this.onMouseDown(ev);
        },
        false
      );
      this.canvas.addEventListener(
        "mousemove",
        (ev) => {
          this.onMouseMove(ev);
        },
        false
      );
      this.canvas.addEventListener(
        "mouseup",
        (ev) => {
          this.onMouseUp(ev);
        },
        false
      );

      document.addEventListener(
        "keypress",
        (ev) => {
          this.onKeyPress(ev);
        },
        false
      );
      document.addEventListener(
        "keyup",
        (ev) => {
          this.onKeyRelease(ev);
        },
        false
      );
    }
    // Listening to buttons
    document.querySelectorAll(".btn-body").forEach((b) => {
      b.addEventListener("click", (ev) => {
        this.sendCommand({ button: ev.currentTarget.dataset.action, event: "down" });
        if (CONFIG.bindings.button_keydown_event) {
          this.sendCommand({ button: ev.currentTarget.dataset.action, event: "up" });
        }
      });
      b.addEventListener("touchstart", (ev) => {
        ev.preventDefault();
        this.sendCommand({ button: ev.currentTarget.dataset.action, event: "up" });
      });
    });
  }

  get dimensions() {
    return {
      internalRadius: (this.canvas.width - (this.canvas.width / 2 + 10)) / 2,
      externalRadius:
        (this.canvas.width - (this.canvas.width / 2 + 10)) / 2 + 30,
      maxMoveStick: (this.canvas.width - (this.canvas.width / 2 + 10)) / 2 + 5,
      directionLimits: {
        HorizontalPlus: this.canvas.width / 10,
        HorizontalMinus: (-1.0 * this.canvas.width) / 10,
        VerticalPlus: this.canvas.height / 10,
        VerticalMinus: (-1.0 * this.canvas.height) / 10,
      },
    };
  }

  get circumference() {
    return 2 * Math.PI;
  }

  get center() {
    return { x: this.canvas.width / 2, y: this.canvas.height / 2 };
  }

  /**
   * @desc The width of canvas
   * @return Number of pixel width
   */
  GetWidth() {
    return this.canvas.width;
  }

  /**
   * @desc The height of canvas
   * @return Number of pixel height
   */
  GetHeight() {
    return this.canvas.height;
  }

  get position() {
    return this.status.position;
  }

  /**
   * @desc Normalized value of stick position
   * @return Integer from -100 to +100
   */
  get command() {
    return {
      x: (
        100 *
        ((this.status.position.x - this.center.x) /
          this.dimensions.maxMoveStick)
      ).toFixed(),
      y: (
        100 *
        ((this.status.position.y - this.center.y) /
          this.dimensions.maxMoveStick) *
        -1
      ).toFixed(),
    };
  }

  /**
   * @desc Get the direction of the cursor as a string that indicates the cardinal points where this is oriented
   * @return String of cardinal point N, NE, E, SE, S, SW, W, NW and C when it is placed in the center
   */
  get direction() {
    var result = "";
    const horizontal = this.status.position.x - this.center.x;
    const vertical = this.status.position.y - this.center.y;
    const limits = this.dimensions.directionLimits;
    if (vertical > limits.VerticalMinus && vertical < limits.VerticalPlus) {
      result = "C";
    }
    if (vertical <= limits.VerticalMinus) {
      result = "N";
    }
    if (vertical >= limits.VerticalPlus) {
      result = "S";
    }

    if (horizontal <= limits.HorizontalMinus) {
      if (result === "C") {
        result = "W";
      } else {
        result += "W";
      }
    }
    if (horizontal >= limits.HorizontalPlus) {
      if (result === "C") {
        result = "E";
      } else {
        result += "E";
      }
    }
    return result;
  }

  /**
   * @desc Draw the external circle used as reference position
   */
  drawExternal() {
    this.context.beginPath();
    this.context.arc(
      ...Object.values(this.center),
      this.dimensions.externalRadius,
      0,
      this.circumference,
      false
    );
    this.context.lineWidth = this.style.externalLineWidth;
    this.context.fillStyle = this.style.externalStrokeColor;
    this.context.fill();
  }

  /**
   * @desc Draw the internal stick in the current position the user have moved it
   */
  drawInternal() {
    const pos = this.status.position,
      iRad = this.dimensions.internalRadius,
      maxMove = this.dimensions.maxMoveStick;
    if (pos.x < iRad) {
      this.status.position.x = maxMove;
    }
    if (pos.x + iRad > this.canvas.width) {
      this.status.position.x = this.canvas.width - maxMove;
    }
    if (pos.y < iRad) {
      this.status.position.y = maxMove;
    }
    if (pos.y + iRad > this.canvas.height) {
      this.status.position.y = this.canvas.height - maxMove;
    }

    // Draw bar
    this.context.beginPath();
    this.context.lineWidth = 20;
    this.context.lineCap = "round";
    this.context.strokeStyle = "#555";
    this.context.moveTo(...Object.values(this.center));
    this.context.lineTo(...Object.values(this.status.position));
    this.context.stroke();
    //

    this.context.beginPath();
    this.context.arc(
      ...Object.values(this.status.position),
      iRad,
      0,
      this.circumference,
      false
    );

    // create radial gradient
    var grd = this.context.createRadialGradient(
      ...Object.values(this.center),
      5,
      ...Object.values(this.center),
      200
    );
    // Light color
    grd.addColorStop(0, this.style.internalFillColor);
    // Dark color
    grd.addColorStop(1, this.style.internalStrokeColor);

    this.context.fillStyle = grd;

    // Shadow
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;
    this.context.shadowBlur = 2;
    this.context.shadowColor = "rgba(0, 0, 0, 0.7)";

    this.context.fill();

    // Clear shadow
    this.context.shadowBlur = 0;
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;
    this.context.shadowColor = "transparent";

    this.context.lineWidth = this.style.internalLineWidth;
    this.context.strokeStyle = this.style.internalStrokeColor;
    this.context.stroke();
  }

  sendCommand(cmd) {
    const event = new CustomEvent("command", {
      detail: {
        command: cmd,
      },
    });
    document.dispatchEvent(event);
    // console.log(`Sending command ${Object.values(cmd)}`);
  }

  /*
   ** LISTENERS
   */
  onKeyPress(event) {
    /*
     ** Update for Qwerty keyboard
     */
    // Prevent key repeat
    if (Date.now() - this.status.last < CONFIG.button_repeat_limit) {
      return;
    }
    const button = Object.keys(CONFIG.bindings).find((k) => CONFIG.bindings[k] === event.key);
    this.status.last = Date.now();
    if (["green", "blue", "yellow", "red"].includes(button)) {
      this.sendCommand({ button: button });
      // Display button pressed
      const element = document.querySelector(`.btn-body.${button}`);
      element.classList.add("activate");
    } else {
      switch (button) {
        case CONFIG.bindings.stick_right:
          this.status.position = {
            x: this.center.x + this.dimensions.directionLimits.HorizontalPlus,
            y: this.center.y,
          };
          break;
        case CONFIG.bindings.stick_left:
          this.status.position = {
            x: this.center.x + this.dimensions.directionLimits.HorizontalMinus,
            y: this.center.y,
          };
          break;
        case CONFIG.bindings.stick_down:
          this.status.position = {
            x: this.center.x,
            y: this.center.y + this.dimensions.directionLimits.VerticalPlus,
          };
          break;
        case CONFIG.bindings.stick_up:
          this.status.position = {
            x: this.center.x,
            y: this.center.y + this.dimensions.directionLimits.VerticalMinus,
          };
          break;
        default:
          return;
      }
    }

    this.sendCommand({ stick: this.direction });
    // Delete this.canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Redraw object
    this.drawExternal();
    this.drawInternal();
  }

  onKeyRelease(event) {
    const button = Object.keys(CONFIG.bindings).find((k) => CONFIG.bindings[k] === event.key);
    if (["green", "blue", "yellow", "red"].includes(button)) {
      const element = document.querySelector(`.btn-body.${button}`);
      element.classList.remove("activate");
      if (CONFIG.bindings.button_keydown_event) {
        this.sendCommand({ button: button, event: "up" });
      }
      return;
    }

    this.status.position = this.center;
    if (this.direction != "C") {
      this.sendCommand({ stick: this.direction });
    }
    // Delete this.canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Redraw object
    this.drawExternal();
    this.drawInternal();
  }

  /**
   * @desc Events for manage touch
   */
  onTouchStart(event) {
    this.status.pressed = true;
    event.preventDefault();
  }

  onTouchMove(event) {
    // Prevent the browser from doing its default thing (scroll, zoom)
    event.preventDefault();

    // Save direction
    const old_direction = this.direction;

    if (this.status.pressed && event.targetTouches[0].target === this.canvas) {
      this.status.position.x = event.targetTouches[0].pageX;
      this.status.position.y = event.targetTouches[0].pageY;
      // Manage offset
      if (this.canvas.offsetParent.tagName.toUpperCase() === "BODY") {
        this.status.position.x -= this.canvas.offsetLeft;
        this.status.position.y -= this.canvas.offsetTop;
      } else {
        this.status.position.x -= this.canvas.offsetParent.offsetLeft;
        this.status.position.y -= this.canvas.offsetParent.offsetTop;
      }
      if (this.direction !== old_direction) {
        this.sendCommand({ stick: this.direction });
      }
      // Delete this.canvas
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // Redraw object
      this.drawExternal();
      this.drawInternal();
    }
  }

  onTouchEnd(event) {
    this.status.pressed = false;
    // If required reset position store variable
    if (this.style.autoReturnToCenter) {
      this.status.position = this.center;
      this.sendCommand({ stick: "C" });
    }
    // Delete this.canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Redraw object
    this.drawExternal();
    this.drawInternal();
    //this.canvas.unbind('touchmove');
  }

  /**
   * @desc Events for manage mouse
   */
  onMouseDown(event) {
    this.status.pressed = true;
  }

  onMouseMove(event) {
    if (!this.status.pressed) {
      return;
    }
    // Save direction
    const old_direction = this.direction;

    this.status.position = {
      x: event.pageX,
      y: event.pageY,
    };
    // Manage offset
    if (this.canvas.offsetParent.tagName.toUpperCase() === "BODY") {
      this.status.position.x -= this.canvas.offsetLeft;
      this.status.position.y -= this.canvas.offsetTop;
    } else {
      this.status.position.x -= this.canvas.offsetParent.offsetLeft;
      this.status.position.y -= this.canvas.offsetParent.offsetTop;
    }
    // Delete canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Redraw object
    this.drawExternal();
    this.drawInternal();

    if (this.direction !== old_direction) {
      this.sendCommand({ stick: this.direction });
    }
  }

  onMouseUp(event) {
    this.status.pressed = false;
    // If required reset position store variable
    if (this.style.autoReturnToCenter) {
      this.status.position = this.center;
      this.sendCommand({ stick: "C" })
    }
    // Delete canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Redraw object
    this.drawExternal();
    this.drawInternal();
    //this.canvas.unbind('mousemove');
  }
}
