from flask import Flask
from flask_cors import CORS
from documents_blueprint import documents_blueprint
from students_blueprint import students_blueprint

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(documents_blueprint)
app.register_blueprint(students_blueprint)

if __name__ == '__main__':
    app.run(debug=True)