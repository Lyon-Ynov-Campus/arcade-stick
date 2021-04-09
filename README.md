# Arcade Stick
This project template is an arcade stick emulator

## Installation
- install Python 3.9.4 (virtualenv recommended)
- install requirements with `pip install -r requirements.txt`
- launch server with `gunicorn --worker-class eventlet -w 1 app:app`

## Deploy on Heroku
- create the heroku app on heroku.com
- add the heroku github link to the git remote `git remote add heroku github.com/..../.git`
- push the code to heroku `git push heroku`

## Adapt for your project
- Open app.py and check for TODO comments
