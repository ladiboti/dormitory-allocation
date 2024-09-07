from flask import Blueprint, jsonify
from pymongo import MongoClient

students_blueprint = Blueprint('students', __name__)

client = MongoClient('mongodb://localhost:27017/')
db = client.dormitory
collection = db.students

@students_blueprint.route('/students', methods=['GET'])
def get_students():
    students = list(collection.find({}, {'_id': 0}))
    return jsonify(students)