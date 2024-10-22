from flask import Blueprint, jsonify, request
import pandas as pd
import io
from pymongo import MongoClient
import logging
import os

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

            logging.info(f"Columns in first file: {df1.columns.tolist()}")
            logging.info(f"Columns in second file: {df2.columns.tolist()}")

            logging.info("Contents of the first file:")
            logging.info(df1.head())  
            logging.info("Contents of the second file:")
            logging.info(df2.head())  


            logging.info(f"NaN values in 'Kulcs' column of first file: {df1['Kulcs'].isna().sum()}")
            logging.info(f"NaN values in 'Kulcs' column of second file: {df2['Kulcs'].isna().sum()}")

            merged_df = pd.merge(df1, df2, on='Kulcs', how='inner', suffixes=('', '_next'))
            logging.info(f"Merged DataFrame:\n{merged_df.head()}")

            file_name = "merged_data.xlsx"
            file_path = os.path.join(os.path.dirname(__file__), file_name)
            merged_df.to_excel(file_path, index=False)

            logging.info(f"Excel file saved at {file_path}")

            received_documents.clear()

            return jsonify({'message': 'Files uploaded and Excel saved successfully.'}), 200

    logging.info("Waiting for all required documents")
    return jsonify({'message': 'Waiting for all required documents'}), 200