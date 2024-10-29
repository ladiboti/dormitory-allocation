from flask import Blueprint, jsonify, request
from pymongo import MongoClient
import logging
from bson import json_util

calculate_scores_blueprint = Blueprint('scores', __name__)


@calculate_scores_blueprint.record_once
def setup(state):
    global db
    db = state.options['db']


def calculate_application_score(application):
    # felveteli pontszamok hol vannak tarolva? xd
    # felev?
    return (
        application["admission_score"] if application["Félév_next"] == "2"
        else application["Ösztöndíjindex"] if application["Félév_next"] == "3"
        else round((application["Ösztöndíjindex"] + application["Ösztöndíjindex_next"]) / 2, 2)
    )


@calculate_scores_blueprint.route('/calculate_scores', methods=['GET'])
def calculate_scores():
    collection_name = 'dummy_applications_collection'
    try:
        applications = list(db[collection_name].find())
        for application in applications:
            logging.info(f'Starting to calculate the score of: {application['Neptun kód']}')

            score =  calculate_application_score(application)
            application['Kollégiumi átlag'] = score

            basis = (
                    'admission score' if application['Félév_next'] == 2 
                    else 'scholarship index' if application['Félév_next'] == 3 
                    else 'average of last two scholarship indices'
            )

            logging.info(
                f"Neptun Code: {application['Neptun kód']} - "
                f"Calculated score based on {basis}: {score}"
            )

        for application in applications:
            db[collection_name].update_one(
                    {'_id': application['_id']}, 
                    {'$set': {
                        'Kollégiumi átlag': application['Kollégiumi átlag']
                    }}
            )
            logging.info(f'Successfully commited the score of {application['Neptun kód']}')
            
        return jsonify({
            'message': 'Scores calculated and added to applications.',
            'applications': json_util.dumps(applications)
        }), 200
    
    except Exception as e:
        logging.error(f"Error calculating scores: {e}")
        return jsonify({'message': 'Error calculating scores.', 'error': str(e)}), 500