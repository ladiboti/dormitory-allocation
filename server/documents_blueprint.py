from flask import Blueprint, jsonify, request
import pandas as pd
import io
from pymongo import MongoClient
import logging
import os

documents_blueprint = Blueprint('documents', __name__)
logging.basicConfig(level=logging.INFO)
received_documents = {}


# for future usage
@documents_blueprint.record_once
def setup(state):
    global db
    db = state.options['db']


def commit_dataframe_to_db(df, collection_name):
    try:
        logging.info(f"Committing DataFrame to the '{collection_name}' collection.")

        records = df.to_dict(orient="records")

        if not records:
            logging.error("The provided DataFrame is empty, no data to commit")
            return "The DataFrame is empty, no data to commit."
        
        collection = db[collection_name]
        collection.insert_many(records)

        logging.info(f"Successfully committed {len(records)} records to the '{collection_name}' collection.")
        return f"Successfully committed {len(records)} records."
    
    except Exception as e:
        logging.error(f"Error committing DataFrame to the database: {e}")
        return f"Error committing DataFrame to the database: {e}"



@documents_blueprint.route('/upload_documents', methods=['POST'])
def upload_documents():
    global received_documents

    logging.info("Request received")
    
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

        required_documents = ['first_semester_applications', 'second_semester_applications', 'dormitory_orders']

        if all(doc in received_documents for doc in required_documents):
            logging.info("All required documents received")
            file1 = io.BytesIO(received_documents['first_semester_applications'])
            file2 = io.BytesIO(received_documents['second_semester_applications'])
            file3 = io.BytesIO(received_documents['dormitory_orders'])

            df1 = pd.read_excel(file1)
            df2 = pd.read_excel(file2)
            df3 = pd.read_excel(file3)

            logging.info(f"\nColumns in first file: {df1.columns.tolist()}")
            logging.info(f"\nColumns in second file: {df2.columns.tolist()}")
            logging.info(f"\nColumns in third file: {df3.columns.tolist()}")

            logging.info("\nContents of the first file:")
            logging.info(df1.head())  
            logging.info("\nContents of the second file:")
            logging.info(df2.head())  
            logging.info("\nContents of the third file:")
            logging.info(df3.head())  

            logging.info(f"\nNaN values in 'Kulcs' column of first file: {df1['Kulcs'].isna().sum()}")
            logging.info(f"\nNaN values in 'Kulcs' column of second file: {df2['Kulcs'].isna().sum()}")
            logging.info(f"\nNaN values in 'Neptun kód' column of third file: {df3['Neptun kód'].isna().sum()}")

            merged_df = pd.merge(df1, df2, on='Kulcs', how='outer', suffixes=('', '_next'))
            logging.info(f"\nMerged DataFrame:\n{merged_df.head()}")
            
            # kezeld majd le a _next adatokat is, de amugy jo
            final_df = merged_df.set_index('Neptun kód').join(df3.set_index('Neptun kód'), how='left', rsuffix='_from_df3').reset_index()
            logging.info(f"\nMerged DataFrame:\n{final_df.head()}")

            db_commit_message = commit_dataframe_to_db(final_df, "dummy_applications_collection")
            logging.info(f"Commit message: {db_commit_message}")

            file_name = "merged_data.xlsx"
            file_path = os.path.join(os.path.dirname(__file__), file_name)
            final_df.to_excel(file_path, index=False)

            logging.info(f"\nExcel file saved at {file_path}")

            received_documents.clear()

            return jsonify({'message': 'Files uploaded and Excel saved successfully.'}), 200

    logging.info("Waiting for all required documents")
    return jsonify({'message': 'Waiting for all required documents'}), 200