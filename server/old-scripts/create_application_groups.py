import sys
import subprocess
import pymongo
from collections import defaultdict, OrderedDict


# Csatlakozás a MongoDB-hez
client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['dormitory']  # Adatbázis kiválasztása
collection = db['students']  # Gyűjtemény kiválasztása
groups_collection = db['groups']  # Gyűjtemény kiválasztása a csoportok számára

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

# Kapcsolat lezárása
client.close()