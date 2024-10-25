from flask import Blueprint, jsonify, request
import logging
from pymongo import MongoClient

allocation_blueprint = Blueprint('allocation', __name__)
logging.basicConfig(level=logging.INFO)

@allocation_blueprint.record_once
def setup(state):
    global db
    db = state.options['db']


@allocation_blueprint.route('/allocation', methods=['POST'])
def dormitory_allocation():
    groups_collection = db["dummy_groups"]

    first_group = groups_collection.find_one({}, {"applications": 1, "_id": 0})

    if first_group and first_group.get("applications"):
        first_application = first_group["applications"][0]
        dormitory_order = first_application.get("Kollégium_rangsor", [])

        # ez cooked
        dormitories = {dormitory: {"applications": [], "capacity": int(total_capacity * global_admission_rate)} for dormitory in dormitory_order}
    else:
        logging.error("No valid applications found in the first group.")
        return jsonify({'error': 'No valid applications found in the database.'}), 500

    denied_applications = []
    accepted_applications = []
    waiting_list_applications = []

    # Initialize dormitory structure
    dormitories = {dorm: {"applications": [], "capacity": dormitory_capacity} for dorm in dormitory_names}

      # Process applications
    for application in applications:
        if application['score'] >= 50:  # Example threshold score
            accepted_applications.append(application)
            # Allocate to dormitories
            for dorm in application['dormitory_order']:
                if dorm in dormitories and len(dormitories[dorm]['applications']) < dormitories[dorm]['capacity']:
                    dormitories[dorm]['applications'].append(application)
                    break
        else:
            waiting_list_applications.append(application)