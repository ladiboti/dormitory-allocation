from flask import Blueprint, jsonify, request
import pandas as pd
import io
from pymongo import MongoClient
import logging

documents_blueprint = Blueprint('documents', __name__)

logging.basicConfig(level=logging.INFO)

# for future usage
@documents_blueprint.record_once
def setup(state):
    global db
    db = state.options['db']

received_documents = {}


# untested
@documents_blueprint.route('/upload_documents', methods=['POST'])
def upload_documents():
    global received_documents

    logging.info("Request received")
    
    # Kiíratás a kérés fájljairól
    logging.info("Received files:")
    for file_key in request.files:
        logging.info(f"File: {file_key}")

    doc_type = request.form.get('documentType')
    logging.info(f"Document type: {doc_type}")

    if not doc_type:
        return jsonify({'message': 'Document type is required'}), 400

    if doc_type in request.files:
        logging.info(f"File received for document type: {doc_type}")
        received_documents[doc_type] = request.files[doc_type].read()

        required_documents = ['first_semester_applications', 'second_semester_applications']

        if all(doc in received_documents for doc in required_documents):
            logging.info("All required documents received")
            file1 = io.BytesIO(received_documents['first_semester_applications'])
            file2 = io.BytesIO(received_documents['second_semester_applications'])

            df1 = pd.read_excel(file1)
            df2 = pd.read_excel(file2)

            merged_df = pd.merge(df1, df2, on='Kulcs', suffixes=('', '_next'))
            result = merged_df.to_dict(orient='records')

            received_documents.clear()

            # logging.info(f"Response: {result}")
            return jsonify('message': 'successful upload'), 200 

    logging.info("Waiting for all required documents")
    return jsonify({'message': 'Waiting for all required documents'}), 200