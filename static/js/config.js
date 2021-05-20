export const CONFIG = {
    display_update_ms: 100,
    joystick_mode: "UPDATE", // send joystick status every update_ms milliseconds
    // joystick_mode: "EVENT", // send joystick event when it move
    joystick_update_ms: 100,
    button_repeat_limit: 100,
    button_keydown_event: false,
    bindings: {
      green: "b",
      blue: "h",
      yellow: "n",
      red: "j",
      stick_up: "z",
      stick_down: "s",
      stick_left: "q",
      stick_right: "d"
    }
}