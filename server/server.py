from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from pymongo import MongoClient
import os

load_dotenv()

from api_blueprints import auth_blueprint, documents_blueprint, protected_blueprint, students_blueprint

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

mongo_uri = os.getenv('MONGO_URI')
client = MongoClient(mongo_uri)
db = client.dormitory

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

jwt = JWTManager(app)

app.register_blueprint(documents_blueprint, db=db)
app.register_blueprint(students_blueprint, db=db)
app.register_blueprint(auth_blueprint, db=db)
app.register_blueprint(protected_blueprint, db=db)

if __name__ == '__main__':
    app.run(debug=True)