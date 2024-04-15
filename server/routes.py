from flask import request, jsonify, Blueprint, make_response, redirect, url_for
import requests
from flask_login import login_user, logout_user, current_user, login_required
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import os
import ssl
from flask import session
from flask_cors import CORS, cross_origin


mongodb_uri = os.getenv('MONGODB_URI')
client = MongoClient(mongodb_uri, ssl=True, ssl_cert_reqs=ssl.CERT_NONE)
db = client['users']
collection = db['details']


# authentication routes
auth_routes = Blueprint('auth', __name__)

@auth_routes.route('/login', methods=['POST', 'GET'])
def login():
    from server.models import User

    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Missing email or password'}), 400

        user_data = collection.find_one({'email': email})

        if not user_data or not check_password_hash(user_data['password'], password):
            return jsonify({'error': 'Invalid email or password'}), 401

        user_id = str(user_data.get('_id'))
        session['user_id'] = user_id
        
        user = User(username=user_data['username'], email=user_data['email'], password=user_data['password'])
        login_user(user) 
        return jsonify({'message': 'Login successful', 'user_id': str(user_id)})
    
    elif request.method == 'GET':
        if 'user_id' in session:
            next_pathname = request.args.get('next')
            if next_pathname:
                session.modified = True
                return redirect(next_pathname)
            else:
                return redirect(url_for('auth.signup'))
        else:
            return redirect(url_for('auth.signup'))


@auth_routes.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    session.modified = True
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if collection.find_one({'email': email}):
        return jsonify({'error': 'Username or email already exists'}), 400

    # Create a new user
    hashed_password = generate_password_hash(password)
    user_data = {
        'username': username,
        'email': email,
        'password': hashed_password,
        'applications': []
    }
    collection.insert_one(user_data)

    return jsonify({'message': 'User created successfully'})


@auth_routes.route('/logout', methods=['POST'])
@login_required
def logout():
    session.modified = True
    logout_user()
    return jsonify({'message': 'Logout successful'})



# job routes
job_routes = Blueprint('job', __name__)

@job_routes.route('/job', methods=['GET', 'OPTIONS'])
@login_required
def get_applications():
    session.modified = True
    session_token = request.cookies.get('session')
    session_token_str = str(session_token)

    response = make_response()
    response.set_cookie('session', session_token_str, secure=True, samesite='None')
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Authorization')
    response.headers.add('Access-Control-Allow-Credentials', 'true') 

    if request.method == 'OPTIONS':
        # Respond to preflight requests with CORS headers
        print("options")
        return response, 200

    else: 
        print("get")
        user_data = collection.find_one({'email': current_user.email})
        print(user_data)
        if user_data:
            applications = user_data.get('applications', [])
            application_list = []
            for app in applications:
                application_list.append({
                    'company': app['company'],
                    'position': app['position'],
                    'website': app['website'],
                    'jobID': app['jobID'],
                    'applicationDate': app['applicationDate'],
                    'status': app['status'],
                })

            listData = jsonify(application_list)
            response.data = listData.get_data() 
            return response, 200
        else:
            response = jsonify({'message': 'No applications found'})
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            return response


@job_routes.route('/job/newJob', methods=['POST'])
@login_required
def new_job():
    session.modified = True
    data = request.get_json()
    position_data = data.get('position') or ' '
    company_data = data.get('company') or ' '
    website_data = data.get('website') or ' '
    jobID_data = data.get('jobID') or ' '
    applicationDate_data = data.get('applicationDate') or ' '
    status_data = data.get('status') or ' '
    
    new_application = {
        'position': position_data,
        'company': company_data,
        'website': website_data,
        'jobID': jobID_data,
        'applicationDate': applicationDate_data,
        'status': status_data
    }

    current_user_email = current_user.email
    collection.update_one({'email': current_user_email}, {'$push': {'applications': new_application}})

    return jsonify({'message': 'New application saved successfully'}), 201


@job_routes.route('/job/<id>', methods=['GET', 'POST'])
@login_required
def get_selected_application(id):
    if request.method == 'GET':
        # Retrieve application data based on the provided URL
        company, jobID = id.split('-') 

        user_data = collection.find_one({'email': current_user.email})
        applications = user_data.get('applications', [])

        for app in applications:
            if app['company'] == company and app['jobID'] == jobID:
                return jsonify({
                    'company': app['company'],
                    'position': app['position'],
                    'website': app['website'],
                    'jobID': app['jobID'],
                    'applicationDate': app['applicationDate'],
                    'status': app['status']
                })

        return jsonify({'error': 'Application not found'}), 404


    elif request.method == 'POST':
        data = request.json
        session.modified = True
        company, jobID = id.split('-')

        user_data = collection.find_one({'email': current_user.email})

        # Check if the user document exists
        if user_data:
            applications = user_data.get('applications', [])

            for app in applications:
                if app['company'] == company and app['jobID'] == jobID:
                    # Update the fields of the matched application
                    app['company'] = data.get('company', app['company'])
                    app['position'] = data.get('position', app['position'])
                    app['website'] = data.get('website', app['website'])
                    app['jobID'] = data.get('jobID', app['jobID'])
                    app['applicationDate'] = data.get('applicationDate', app['applicationDate'])
                    app['status'] = data.get('status', app['status'])
                    
                    # Update the user document in the collection
                    collection.update_one({'email': current_user.email}, {'$set': {'applications': applications}})
                    return jsonify({'message': 'Application updated successfully'})

        return jsonify({'error': 'Application not found'}), 404


@job_routes.route('/job/motivate', methods=['GET'])
def get_job_opportunity():
    try:
        session.modified = True
        authorization_token = request.headers.get('Authorization')
        headers = {
            "Authorization": authorization_token,
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cache-Control": "no-cache"
        }
        api_key = os.environ.get('REACT_APP_FINDWORK_API_KEY')

        print(str(api_key))
        print(authorization_token)
        
        url = "https://findwork.dev/api/jobs/?&search=frontend,software,fullstack,backend,developer&employment_type=full%20time&remote=true&sort_by=date_posted&limit=7"
        response = requests.get(url, headers=headers)
        print(response.headers)
        print(response.text)
        response.raise_for_status()
        data = response.json()
        return jsonify(data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
