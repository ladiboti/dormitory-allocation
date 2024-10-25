from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from pymongo import MongoClient
import os
import api_blueprints as api

load_dotenv()


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

mongo_uri = os.getenv('MONGO_URI')
client = MongoClient(mongo_uri)
db = client.dormitory

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

jwt = JWTManager(app)

app.register_blueprint(api.documents_blueprint, db=db)
app.register_blueprint(api.students_blueprint, db=db)
app.register_blueprint(api.auth_blueprint, db=db)
app.register_blueprint(api.protected_blueprint, db=db)
app.register_blueprint(api.calculate_scores_blueprint, db=db)
app.register_blueprint(api.create_application_groups_blueprint, db=db)
app.register_blueprint(api.allocation_blueprint, db=db)

if __name__ == '__main__':
    app.run(debug=True)