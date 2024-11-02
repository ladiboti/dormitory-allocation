from typing import OrderedDict
from flask import Blueprint, jsonify, request
from pymongo import MongoClient
from collections import defaultdict
import logging
from bson import json_util

# Setting up logging configuration
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

create_application_groups_blueprint = Blueprint('groups', __name__)

@create_application_groups_blueprint.record_once
def setup(state):
    global db
    db = state.options['db']

@create_application_groups_blueprint.route('/create_groups', methods=['GET'])
def create_groups():
    collection = db['dummy_applications_collection'] 
    groups_collection = db['dummy_groups']  

    # Csoportok törlése a gyűjteményből
    logger.info("Deleting existing groups from the database.")
    groups_collection.delete_many({})
    
    grouped_applications = defaultdict(list)

    # Adatok csoportosítása
    logger.debug("Grouping applications based on Modul kód and Szemeszter_next.")
    for application in collection.find():
        key = (application["Modul kód"], application["Szemeszter_next"])
        grouped_applications[key].append(application)
        logger.debug(f"Grouped application: {application} under key: {key}")

    keys_to_delete = []

    # Csoportok egyesítése, ha kevesebb mint 5 jelentkezés van
    logger.info("Merging groups with fewer than 5 applications.")
    for key, value in grouped_applications.items():
        if len(value) < 5:
            next_key = (key[0], int(key[1]) + 1)
            logger.debug(f"Checking next_key for merging: {next_key}")

            while next_key not in grouped_applications and next_key[1] < 16:
                next_key = (key[0], next_key[1] + 1)
                logger.debug(f"Incremented next_key: {next_key}")

            if next_key in grouped_applications:
                grouped_applications[next_key] += value
                keys_to_delete.append(key)
                logger.info(f"Merged group {key} into {next_key}.")

    # Kis csoportok törlése
    logger.info("Deleting small groups.")
    for key in keys_to_delete:
        del grouped_applications[key]
        logger.debug(f"Deleted group: {key}")

    # Csoportok rendezése
    logger.debug("Sorting grouped applications.")
    grouped_applications = OrderedDict(sorted(grouped_applications.items(), key=lambda x: x[0]))

    # Csoportok beillesztése a gyűjteménybe
    # TODO: max_intake hardocded!!!
    logger.info("Inserting groups into the database.")
    for key, value in grouped_applications.items():
        sorted_applications = sorted(value, key=lambda x: x["Kollégiumi átlag"], reverse=True)
        student_count = len(sorted_applications)
        group_document = {
            "group": key, 
            "applications": sorted_applications, 
            "student_count": student_count,
            "max_intake": 100    
        }
        result = groups_collection.insert_one(group_document)
        logger.debug(f"Inserted group document: {group_document}")

    logger.info(f"Groups created successfully. Total groups created: {len(grouped_applications)}")
    return jsonify({"message": "Groups created successfully", "group_count": len(grouped_applications)}), 200


@create_application_groups_blueprint.route('/update_max_intake', methods=['PUT'])
def update_max_intake():
    data = request.get_json()
    group_key = data.get("group")  # expects ["GT-PT-BA2", 14] format
    new_max_intake = data.get("max_intake")
    
    if not group_key or not isinstance(group_key, list) or len(group_key) != 2:
        return jsonify({"error": "Invalid group key format. Expected a list with code and semester."}), 400
    if not isinstance(new_max_intake, int):
        return jsonify({"error": "Invalid max intake value. Expected an integer."}), 400

    # Update the max_intake for the specific group
    result = db['dummy_groups'].update_one(
        {"group": group_key},
        {"$set": {"max_intake": new_max_intake}}
    )

    if result.matched_count == 0:
        return jsonify({"message": "Group not found"}), 404

    return jsonify({"message": "Max intake updated successfully", "group": group_key, "new_max_intake": new_max_intake}), 200
