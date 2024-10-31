from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

students_blueprint = Blueprint('students', __name__)


@students_blueprint.record_once
def setup(state):
    global db
    db = state.options['db']

# TODO: jwt_required() on frontend as well!!!!!!!!!!!!!
# get_collection_data() is used instead
@students_blueprint.route('/get_students', methods=['GET'])
def get_students():
    collection = db.students
    students = list(collection.find({}, {'_id': 0})) 
    return jsonify(students)


@students_blueprint.route('/db/<collection_name>', methods=['GET'])
def get_collection_data(collection_name):
    collection = db[collection_name]
    documents = list(collection.find({}))  

    def remove_id_fields(obj):
        if isinstance(obj, dict):
            obj.pop('_id', None)  
            for key, value in obj.items():
                remove_id_fields(value)  
        elif isinstance(obj, list):
            for item in obj:
                remove_id_fields(item)  

    for document in documents:
        remove_id_fields(document)

    return jsonify(documents), 200



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