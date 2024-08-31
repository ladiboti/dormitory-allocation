from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client.dormitory
collection = db.students

@app.route('/students', methods=['GET'])
def get_students():
    students = list(collection.find({}, {'_id': 0}))
    return jsonify(students)

@app.route('/upload_documents', methods=['POST', 'OPTIONS'])
def upload_documents():
    response = flask.jsonify({'some': 'data'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True)