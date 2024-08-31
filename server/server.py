from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

client = MongoClient('mongodb://localhost:27017/')
db = client.dormitory
collection = db.students

@app.route('/students', methods=['GET'])
def get_students():
    students = list(collection.find({}, {'_id': 0}))
    return jsonify(students)

@app.route('/upload_documents', methods=['POST'])
def upload_documents():
    form_data = request.form
    file_data = request.files

    for key, value in form_data.items():
        print(f"Form field {key}: {value}")

    for key in file_data:
        file = file_data[key]
        print(f"File field {key}:")
        print(f"\tFilename: {file.filename}")
        print(f"\tContent type: {file.content_type}")
        print(f"\tSize: {len(file.read())} bytes")

    return jsonify({'message': 'Received data'})


if __name__ == '__main__':
    app.run(debug=True)