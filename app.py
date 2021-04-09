from flask import Flask, url_for, render_template, request
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)
info = ""

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
    global info
    msg = info
    if info:
        info = ''
    return msg

"""
TODO: Update to send commands to the remote game
"""
@socketio.on('command')
def send_commands(json):
    global info
    if 'stick' in json:
        info = "Stick {}".format(json['stick'])
    elif 'button' in json:
        info = "Button {}".format(json['button'])

"""
Starting App
"""
if __name__ == '__main__':
    socketio.run(app)