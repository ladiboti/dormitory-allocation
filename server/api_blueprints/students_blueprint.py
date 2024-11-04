from flask import Blueprint, jsonify, request, send_file
from flask_jwt_extended import jwt_required
import logging
from openpyxl import Workbook
import os

students_blueprint = Blueprint('students', __name__)

logging.basicConfig(level=logging.INFO)

@students_blueprint.record_once
def setup(state):
    global db
    db = state.options['db']

# TODO: jwt_required() on frontend as well!!!!!!!!!!!!!
# get_collection_data() is used instead
@students_blueprint.route('/get_students', methods=['GET'])
def get_students():
    collection = db.students
    students = list(collection.find({}, {'_id': 0})) 
    return jsonify(students)


@students_blueprint.route('/db/<collection_name>', methods=['GET'])
def get_paginated_collection_data(collection_name):
    collection = db[collection_name]
    page = request.args.get('page', default=1, type=int)
    page_size = request.args.get('pageSize', default=5, type=int)
    search_term = request.args.get('searchTerm', default='', type=str)
    attributes = request.args.getlist('attributes')

    if not attributes:
        doc = collection.find_one()
        attributes = list(doc.keys()) if doc else []

    projection = {attr: 1 for attr in attributes}
    projection['_id'] = 0  

    skip = (page - 1) * page_size
    search_conditions = {}

    # only string filter works yet, fix this!!!
    if search_term:
        try:
            integer_search_term = int(search_term)
            search_conditions = {
                "$or": [
                    {attr: {"$regex": search_term, "$options": "i"}} for attr in attributes
                ] + [
                    {attr: integer_search_term} for attr in attributes if attr == 'some_integer_field' 
                ]
            }
        except ValueError:
            search_conditions = {
                "$or": [{attr: {"$regex": search_term, "$options": "i"}} for attr in attributes]
            }

    documents = list(collection.find(search_conditions, projection).skip(skip).limit(page_size))
    total_count = collection.count_documents(search_conditions)

    def remove_nested_id_fields(obj):
        if isinstance(obj, dict):
            obj.pop('_id', None)
            for key, value in list(obj.items()):
                remove_nested_id_fields(value)
        elif isinstance(obj, list):
            for item in obj:
                remove_nested_id_fields(item)

    for document in documents:
        remove_nested_id_fields(document)

    return jsonify({
        "data": documents,
        "totalCount": total_count,

    }), 200


@students_blueprint.route('/db/<collection_name>/edit', methods=['POST'])
def edit_collection_data(collection_name):
    collection = db[collection_name]
    data = request.json
    filter_criteria = data.get("filter")  
    updates = data.get("updates")  

    if not filter_criteria or not updates:
        return jsonify({"error": "A szűrők és frissítések megadása kötelező"}), 400

    # Ellenőrizzük, hogy milyen dokumentumok találhatók a szűrők alapján
    found_documents = list(collection.find(filter_criteria))
    
    # Logoljuk az összes megtalált dokumentumot
    if found_documents:
        logging.info(f"Found Documents: {found_documents}")
        logging.info(f"\nNumber of found documents: {len(found_documents)}")
    else:
        logging.info("No documents found matching the filter criteria.")

    # Végrehajtjuk a frissítést
    update_result = collection.update_many(filter_criteria, {"$set": updates})

    return jsonify({
        "modified_count": update_result.modified_count,
        "message": f"{update_result.modified_count} dokumentum módosítva."
    }), 200


@students_blueprint.route('/update_students/<key>', methods=['PUT'])
@jwt_required()
def update_student(key):
    collection = db.students
    student_data = request.json

    result = collection.update_one(
        {'key': key},
        {'$set': student_data}
    )

    if result.matched_count > 0:
        return jsonify({'message': 'Student data updated successfully!'}), 200
    else:
        return jsonify({'message': 'Unable to find student!'}), 404
    
@students_blueprint.route('/export_dormitory_data', methods=['GET'])
def export_dormitory_data():
    dormitories_collection = db['dummy_dormitories']
    
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Dormitory Data"
    
    sheet.append(["Név", "Neptun kód"])
    
    dormitories = dormitories_collection.find()
    
    for dormitory in dormitories:
        dormitory_name = dormitory['dormitory_name']
        applications = dormitory.get('applications', [])
        
        for application in applications:
            neptun_code = application.get('Neptun kód')
            if neptun_code: 
                sheet.append([dormitory_name, neptun_code])
    
    output_file = "felvett_hallgatok.xlsx"
    workbook.save(output_file)
    
    return send_file(output_file, as_attachment=True)


@students_blueprint.route('/export_waitlist_data', methods=['GET'])
def export_waitlist_data():
    # Adatbázis kollekció elérése
    groups_collection = db['dummy_groups']
    
    # Excel munkafüzet létrehozása
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Waitlist Data"
    
    # Fejléc hozzáadása
    sheet.append(["Neptun kód", "Várólista pontszám"])
    
    # Várólistás adatok gyűjtése
    waitlist_data = []
    groups = groups_collection.find()
    
    for group in groups:
        applications = group.get('applications', [])
        for application in applications:
            waitlist_score = application.get('Várólista pontszám')
            neptun_code = application.get('Neptun kód')
            
            if waitlist_score is not None and neptun_code:
                waitlist_data.append({
                    'neptun_code': neptun_code,
                    'score': float(waitlist_score)  # Konvertálás float-ra a rendezéshez
                })
    
    # Rendezés pontszám szerint csökkenő sorrendben
    sorted_data = sorted(waitlist_data, key=lambda x: x['score'], reverse=True)
    
    # Rendezett adatok írása az Excel fájlba
    for data in sorted_data:
        sheet.append([data['neptun_code'], data['score']])
    
    # Excel fájl mentése
    output_file = "varolistas_hallgatok.xlsx"
    workbook.save(output_file)
    
    # Fájl küldése letöltésre
    return send_file(output_file, as_attachment=True)