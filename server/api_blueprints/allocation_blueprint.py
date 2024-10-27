from flask import Blueprint, jsonify, request
import logging
from pymongo import MongoClient
from pprint import pformat

allocation_blueprint = Blueprint('allocation', __name__)
logging.basicConfig(level=logging.INFO)

@allocation_blueprint.record_once
def setup(state):
    global db
    db = state.options['db']


@allocation_blueprint.route('/create_dormitory_collection', methods=['POST'])
def commit_dormitory_collection_to_db():
    applications_collection = db["dummy_applications_collection"]
    dormitories_collection = db["dummy_dormitories"]

    dormitories_collection.delete_many({})

    first_application = applications_collection.find_one({}, {"Kollégium_rangsor": 1, "_id": 0})

    # Log the first application for debugging
    logging.info(f"First application found: {first_application}")

    if first_application and first_application.get("Kollégium_rangsor"):
        dormitory_order = first_application["Kollégium_rangsor"]

        # Insert each dormitory as a separate document
        dormitories = [
            {
                "dormitory_name": dormitory,
                "applications": [],
                "capacity": 2  # Default capacity
            }
            for dormitory in dormitory_order
        ]

        # Bulk insert the dormitory documents
        dormitories_collection.insert_many(dormitories)

        logging.info("Dormitory collection created with individual dormitory documents.")
        return jsonify({'message': 'Dormitory collection created successfully.'}), 200
    
    else:
        logging.error("No valid dormitory rankings found in the applications.")
        return jsonify({'error': 'No valid dormitory rankings found in the database.'}), 500


@allocation_blueprint.route('/allocation', methods=['POST'])
def dormitory_allocation():
    groups_collection = db["dummy_groups"]
    results_collection = db["dummy_allocated_dormitories"]
    dormitories_collection = db["dummy_dormitories"]

    # Clear previous allocations in results
    results_collection.delete_many({})

    # Retrieve dormitory names and capacities from the dormitories collection
    dormitory_docs = list(dormitories_collection.find({}, {"dormitory_name": 1, "capacity": 1, "_id": 1}))
    dormitories = {dorm["dormitory_name"]: dorm for dorm in dormitory_docs}

    # Check if the dormitories collection is structured correctly
    if not dormitories:
        logging.error("No dormitories found in the database.")
        return jsonify({'error': 'No dormitories found in the database.'}), 500

    # Calculate admission rate and capacity
    total_applications_count = sum(len(group["applications"]) for group in groups_collection.find({}))
    global_admission_rate = 0.5
    global_dormitory_capacity = total_applications_count * global_admission_rate
    single_dormitory_capacity = int(global_dormitory_capacity / len(dormitories))

    # Log dormitory setup for debugging
    logging.info(f"Available dormitories:\n{pformat(dormitories)}")

    for group in groups_collection.find():
        denied_applications = []
        accepted_applications = []
        waiting_list_applications = []

        applications = group["applications"]

        # Calculate the threshold score for this group
        threshold_index = int(len(applications) * global_admission_rate)
        threshold_score = applications[threshold_index]["Kollégiumi átlag"]

        for application in applications:
            if application["Kollégiumi átlag"] >= threshold_score:
                application["Felvételt nyert"] = True
                accepted_applications.append(application)
            else:
                application["Felvételt nyert"] = False
                application["Várólista pontszám"] = threshold_score - application["Kollégiumi átlag"]
                waiting_list_applications.append(application)

        # Update each group's applications with admission results
        groups_collection.update_one(
            {"_id": group["_id"]}, 
            {"$set": {
                "applications": applications,
                "threshold_score": threshold_score
            }}
        )
        
        # Allocate accepted applications to dormitories
        for application in accepted_applications:
            allocated = False
            for dormitory_name in application["Kollégium_rangsor"]:
                dormitory_doc = dormitories_collection.find_one({"dormitory_name": dormitory_name})

                if dormitory_doc and len(dormitory_doc["applications"]) < dormitory_doc["capacity"]:
                    dormitories_collection.update_one(
                        {"dormitory_name": dormitory_name},
                        {"$push": {"applications": application}}
                    )

                    # Save allocation to the results collection
                    accepted_data = {
                        "neptun_code": application["Neptun kód"],
                        "key": application["Kulcs"],
                        "accepted_dormitory": dormitory_name,
                        "score": application["Kollégiumi átlag"],
                        "dormitory_order": application["Kollégium_rangsor"]
                    }
                    results_collection.insert_one(accepted_data)
                    allocated = True
                    break

            # Log if no allocation was found
            if not allocated:
                logging.warning(f"No available space for application: {application['Neptun kód']}")

    return jsonify({'message': 'Allocation successful'}), 200