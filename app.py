import logging
from flask import Flask, url_for, render_template, request
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

"""
Basic server implementation, nothing to do here but you can make it better
"""
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path>')
def static_files(path):
    return url_for('static', filename=path)

"""
TODO: Update to retrieve logs from the remote game
"""
@app.route('/info', methods=['GET'])
def display_info():
    return ""

"""
TODO: Update to send commands to the remote game
"""
@socketio.on('command')
def send_commands(json):
    # See the log file
    app.logger.info("Incoming command %s", json)
    # Send command to the game
    pass

"""
Starting App
"""
if __name__ == '__main__':
    socketio.run(app)
