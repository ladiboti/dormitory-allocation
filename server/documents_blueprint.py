from flask import Blueprint, jsonify, request
import pandas as pd
import io
from pymongo import MongoClient

documents_blueprint = Blueprint('documents', __name__)

# for future usage
@documents_blueprint.record_once
def setup(state):
    global db
    db = state.options['db']

received_documents = {}

@documents_blueprint.route('/upload_documents', methods=['POST'])
def upload_documents():
    global received_documents

    doc_type = request.form.get('documentType')
    if not doc_type:
        return jsonify({'message': 'Document type is required'}), 400
    
    if doc_type in request.files:
        received_documents[doc_type] = request.files[doc_type].read()

        required_documents = ['first_semester_applications', 'second_semester_applications']

        if all(doc in received_documents for doc in received_documents):
            file1 = io.BytesIO(received_documents['first_semester_applications'])
            file2 = io.BytesIO(received_documents['second_semester_applications'])

            df1 = pd.read_excel(file1)
            df2 = pd.read_excel(file2)

            merged_df = pd.merge(df1, df2, on='Kulcs', suffixes=('', '_next'))
            result = merged_df.to_dict(orient='records')

            # might cause problems in the near future, be cautious young padawan
            received_documents.clear()

            return jsonify(result)

    return jsonify({'message': 'Waiting for all required documents'}), 200