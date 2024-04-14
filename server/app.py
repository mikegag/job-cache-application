from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_login import LoginManager
from dotenv import load_dotenv
import os
import pymongo
from pymongo import MongoClient
import ssl
from server.routes import auth_routes, job_routes
 
# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, static_folder='../job-cache-app/build')
CORS(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'

mongodb_uri = os.getenv('MONGODB_URI')
client = pymongo.MongoClient(mongodb_uri, ssl=True, ssl_cert_reqs=ssl.CERT_NONE)
db = client['users']
collection = db['details']

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = 7200

app.register_blueprint(auth_routes)
app.register_blueprint(job_routes)

@login_manager.user_loader
def load_user(user_id):
    from server.models import User 
    return User.get(user_id)


# Serve React's index.html file
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    # app.run(ssl_context=('cert.pem', 'key.pem'))
    port = int(os.environ.get("PORT", 3000))
    app.run(host='0.0.0.0', port=port)
