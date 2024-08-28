from flask import Flask, jsonify
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

if __name__ == '__main__':
    app.run(debug=True)