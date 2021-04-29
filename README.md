# Arcade Stick
This project template is an arcade stick emulator

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
- `docker build . -t arcade-stick`
- `docker run -p 8000:8000 arcade-stick`

## Deploy on Heroku
- create the heroku app on heroku.com
- add the heroku github link to the git remote `git remote add heroku github.com/..../.git`
- push the code to heroku `git push heroku`

## Adapt for your project
- Open app.py and check for TODO comments
