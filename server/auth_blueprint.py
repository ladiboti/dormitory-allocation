from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

auth_blueprint = Blueprint('auth', __name__)


@auth_blueprint.record_once
def setup(state):
    global db
    db = state.options['db']


@auth_blueprint.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')

    if db.users.find_one({'username': username}):
        return jsonify({'message': 'User already exists'}), 400
    
    hashed_password = generate_password_hash(password)
    db.users.insert_one({'username': username, 'password': hashed_password})

    return jsonify({'message': 'Successful registration'}), 201


@auth_blueprint.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    user = db.users.find_one({'username': username})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'msg': 'Hibás felhasználónév vagy jelszó'}), 401
    
    access_token = create_access_token(identity={'username': username})

    return jsonify(access_token=access_token), 200