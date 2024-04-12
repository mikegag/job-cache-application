from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from app import collection


# User model
class User(UserMixin):
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)
        self.applications = []

    def get_id(self):
        # Return the user's email as the unique identifier
        return self.email
        
    @staticmethod
    def get(user_id):
        user_data = collection.find_one({'email': user_id})
        if user_data:
            return User(email=user_data['email'], username = user_data['username'], password=user_data['password'])
        return None

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


# Used to store applications within User model
class Application():
    def __init__(self, company, position, website, jobID, applicationDate, status):
        self.company = company
        self.position = position
        self.website = website
        self.jobID = jobID
        self.applicationDate = applicationDate
        self.status = status

    def serialize(self):
        return {
            'company': self.company,
            'position': self.position,
            'website': self.website,
            'jobID': self.jobID,
            'applicationDate': self.applicationDate,
            'status': self.status
        }
