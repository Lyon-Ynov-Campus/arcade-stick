from flask import Flask, url_for, render_template, request
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

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
def displayInfo():
    return "LOG"


"""
TODO: Update to send commands to the remote game
"""
@app.route('/commands', methods=['POST'])
def send_commands():
    print(request.form)
    pass

"""
Starting App
"""
if __name__ == '__main__':
    app.run(threaded=True, port=5000)