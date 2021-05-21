# Arcade Stick
This project template is an arcade stick emulator

## Configuration
You can edit the `static/js/config.js` file to choose the behavior of the jostick.
- `display_update_ms` will change the update time of the LCD Display
- `joystick_mode` will change between regular update of the joystick or event based updates where commands are sent when the joystick is moved
- `joystick_update_ms` will change the update time of the Joystick
- `button_repeat_limit` limit of key event sent
- `button_keydown_event` send event: up event when buttons are released
- `bindings` key bindings to control the arcade board

## Installation
- Gunicorn only runs on UNIX, therefore windows user will use WSL2, [setup instructions](https://docs.microsoft.com/fr-fr/windows/wsl/install-win10)
- install Python 3.9.4 (virtualenv recommended)
    - [instructions](https://python.doctor/page-virtualenv-python-environnement-virtuel)
- install requirements with `pip install -r requirements.txt`
- launch server with either:
    - `gunicorn --worker-class eventlet -w 1 app:app`
    - `flask run`
    - `./start.sh`

## Run on Docker
You can also run arcade stick on Docker
- `docker-compose up`
The folder will be mounted in docker compose so the server will relaunch on edit.

## Deploy on Heroku
- create the heroku app on heroku.com
- add the heroku github link to the git remote `git remote add heroku github.com/..../.git`
- push the code to heroku `git push heroku`

## Adapt for your project
- Open app.py and check for TODO comments
