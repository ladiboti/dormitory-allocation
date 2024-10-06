from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

students_blueprint = Blueprint('students', __name__)


@students_blueprint.record_once
def setup(state):
    global db
    db = state.options['db']

# TODO: jwt_required() on frontend as well!!!!!!!!!!!!!
@students_blueprint.route('/get_students', methods=['GET'])
def get_students():
    collection = db.students
    students = list(collection.find({}, {'_id': 0})) 
    return jsonify(students)


@students_blueprint.route('/update_students/<key>', methods=['PUT'])
@jwt_required()
def update_student(key):
    collection = db.students
    student_data = request.json

    result = collection.update_one(
        {'key': key},
        {'$set': student_data}
    )

    if result.matched_count > 0:
        return jsonify({'message': 'Student data updated successfully!'}), 200
    else:
        return jsonify({'message': 'Unable to find student!'}), 404