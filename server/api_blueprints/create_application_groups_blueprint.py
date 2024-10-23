from flask import Blueprint, jsonify, request
from pymongo import MongoClient
import logging
from bson import json_util

create_application_groups_blueprint = Blueprint('scores', __name__)

@create_application_groups_blueprint.record_once
def setup(state):
    global db
    db = state.options['db']

# fix it tomorrow
@create_application_groups_blueprint.route('/calculate_scores', methods=['POST'])
def create_groups():
    collection = db['dummy_applications_collection']  # Gyűjtemény kiválasztása
    groups_collection = db['dummy_groups']  # Gyűjtemény kiválasztása a csoportok számára

    # Csoportok törlése a gyűjteményből
    groups_collection.delete_many({})
    grouped_applications = defaultdict(list)

    # Adatok csoportosítása
    for application in collection.find():
        key = (application["admission_unit"], application["semester"])
        grouped_applications[key].append(application)

    keys_to_delete = []

    # Csoportok egyesítése, ha kevesebb mint 5 jelentkezés van
    for key, value in grouped_applications.items():
        if len(value) < 5:
            next_key = (key[0], int(key[1]) + 1)
            while next_key not in grouped_applications and next_key[1] < 16:
                next_key = (key[0], next_key[1] + 1)

            if next_key in grouped_applications:
                grouped_applications[next_key] += value
                keys_to_delete.append(key)

    # Kis csoportok törlése
    for key in keys_to_delete:
        del grouped_applications[key]

    # Csoportok rendezése
    grouped_applications = OrderedDict(sorted(grouped_applications.items(), key=lambda x: x[0]))

    # Csoportok beillesztése a gyűjteménybe
    for key, value in grouped_applications.items():
        sorted_applications = sorted(value, key=lambda x: x["score"], reverse=True)
        group_document = {"group": key, "applications": sorted_applications}
        result = groups_collection.insert_one(group_document)