from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

protected_blueprint = Blueprint('protected', __name__)


@protected_blueprint.record_once
def setup(state):
    global db
    db = state.options['db']


@protected_blueprint.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200