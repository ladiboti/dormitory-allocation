from flask import Blueprint, jsonify

students_blueprint = Blueprint('students', __name__)

@students_blueprint.record_once
def setup(state):
    global db
    db = state.options['db']

@students_blueprint.route('/students', methods=['GET'])
def get_students():
    collection = db.students
    students = list(collection.find({}, {'_id': 0})) 
    return jsonify(students)