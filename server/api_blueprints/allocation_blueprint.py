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


@allocation_blueprint.route('/allocation', methods=['POST'])
def dormitory_allocation():
    groups_collection = db["dummy_groups"]
    results_collection = db["dummy_allocated_dormitories"]

    results_collection.delete_many({})

    first_group = groups_collection.find_one({}, {"applications": 1, "_id": 0})

    if first_group and first_group.get("applications"):
        first_application = first_group["applications"][0]
        dormitory_order = first_application.get("Kollégium_rangsor", [])

        dormitories = {dormitory: {"applications": [], "capacity": None} for dormitory in dormitory_order}
    else:
        logging.error("No valid applications found in the first group.")
        return jsonify({'error': 'No valid applications found in the database.'}), 500

    total_applications_count = sum(len(group["applications"]) for group in groups_collection.find({}))

    # hardcoded, frontend will take care of it
    global_admission_rate = 0.5
    global_dormitory_capacity = total_applications_count * global_admission_rate
    single_dormitory_capacity = int(global_dormitory_capacity / len(dormitories))

    dormitories = {dormitory: {**data, 'capacity': single_dormitory_capacity} for dormitory, data in dormitories.items()}

    logging.info(f"Available dormitories:\n{pformat(dormitories)}")

    for group in groups_collection.find():
        denied_applications = []
        accepted_applications = []
        waiting_list_applications = []

        applications = group["applications"]

        threshold_index = int(len(applications) * global_admission_rate)
        threshold_score = applications[threshold_index]["Kollégiumi átlag"]

        # TODO: szoc, közösségi, stb!!!
        for application in applications:
            if application["Kollégiumi átlag"] >= threshold_score:
                application["Felvételt nyert"] = True
                accepted_applications.append(application)

            else:
                application["Felvételt nyert"] = False
                application["Várólista pontszám"] = threshold_score - application["Kollégiumi átlag"]
                waiting_list_applications.append(application)

        groups_collection.update_one({"_id": group["_id"]}, {"$set": {"applications": applications, \
                                                            "threshold_score": threshold_score}})
        
        # Allocate accepted applications to dormitories
    for application in accepted_applications:
        for i in range(len(dormitory_order)):
            dormitory_name = application["Kollégium_rangsor"][i]  # Assuming dormitory_order contains the dormitory names
            if len(dormitories[dormitory_name]["applications"]) < single_dormitory_capacity:
                dormitories[dormitory_name]["applications"].append(application)
                
                # Save to the new collection
                accepted_data = {
                    "neptun_code": application["Neptun kód"],  # Adjust key as per your data structure
                    "key": application["Kulcs"],  # Add the key if it exists
                    "accepted_dormitory": dormitory_name,
                    "score": application["Kollégiumi átlag"],
                    "dormitory_order": application["Kollégium_rangsor"]
                }
                results_collection.insert_one(accepted_data)
                break

    return jsonify({'message': 'success'}), 200