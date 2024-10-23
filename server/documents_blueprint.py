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

    def log_dataframe_info(df, name):
        logging.info(f"\nColumns in {name}: {df.columns.tolist()}")
        logging.info(f"\nContents of {name}:")
        logging.info(df.head())
        if 'Kulcs' in df.columns:
            logging.info(f"\nNaN values in 'Kulcs' column of {name}: {df['Kulcs'].isna().sum()}")
        if 'Neptun kód' in df.columns:
            logging.info(f"\nNaN values in 'Neptun kód' column of {name}: {df['Neptun kód'].isna().sum()}")

    # Handle file upload and logging
    def process_document(doc_type):
        if doc_type in request.files:
            logging.info(f"File received for document type: {doc_type}")
            received_documents[doc_type] = request.files[doc_type].read()

    # Process required documents
    required_documents = ['first_semester_applications', 'second_semester_applications', 
                          'dormitory_orders', 'major_codes']
    
    for doc in required_documents:
        process_document(doc)

    # Only proceed when all required documents are uploaded
    if all(doc in received_documents for doc in required_documents):
        logging.info("All required documents received")

        # Read all DataFrames
        dfs = {doc: pd.read_excel(io.BytesIO(received_documents[doc])) for doc in required_documents}
        
        # Log information for each DataFrame
        for doc, df in dfs.items():
            log_dataframe_info(df, doc)

        # Merge first and second semester applications
        merged_df = pd.merge(dfs['first_semester_applications'], dfs['second_semester_applications'], 
                             on='Kulcs', how='outer', suffixes=('', '_next'))

        # Join dormitory orders data
        final_df = merged_df.set_index('Neptun kód').join(dfs['dormitory_orders'].set_index('Neptun kód'), 
                                                          how='left', rsuffix='_from_df3').reset_index()

        logging.info(f"\nMerged DataFrame:\n{final_df.head()}")

        # Commit to the database
        applications_db_commit_message = commit_dataframe_to_db(final_df, 'dummy_applications_collection')
        major_codes_db_commit_message = commit_dataframe_to_db(dfs['major_codes'], 'dummy_major_codes_collection')
        logging.info(f"Applications commit message: {applications_db_commit_message}")
        logging.info(f"Major codes commit message: {major_codes_db_commit_message}")

        # Save final DataFrame to Excel for testing purposes
        file_name = "merged_data.xlsx"
        file_path = os.path.join(os.path.dirname(__file__), file_name)
        final_df.to_excel(file_path, index=False)
        logging.info(f"\nExcel file saved at {file_path}")

        # Clear received documents after processing
        received_documents.clear()

        return jsonify({'message': 'Files uploaded and Excel saved successfully.'}), 200

    logging.info("Waiting for all required documents")
    return jsonify({'message': 'Waiting for all required documents'}), 200