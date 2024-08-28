import sys
import subprocess
import pymongo

# Futtatás az additional argumentumokkal (ha szükséges)

"""
subprocess.run(["python3", "create_test_students.py"] + sys.argv[1:])
subprocess.run(["python3", "create_database.py"])
subprocess.run(["python3", "create_application_groups.py"])
"""

# MongoDB csatlakozási paraméterek
client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['dormitory']  # Adatbázis kiválasztása
collection = db['groups']  # Gyűjtemény kiválasztása

# Az első jelentkezés kiválasztása a kollégiumok sorrendjével
first_application = collection.find_one({}, {"applications.dormitory_order": 1, "_id": 0})

# Kollégiumok inicializálása
dormitories = {dormitory: {"applications": []} for dormitory in first_application["applications"][0]["dormitory_order"]}

denied_applications = []
accepted_applications = []
waiting_list_applications = []

# TODO: config file helyett hardcoded értékek
global_admission_rate = 0.1
global_dormitory_capacity = int(sys.argv[1]) * global_admission_rate
single_dormitory_capacity = int(global_dormitory_capacity / len(dormitories))

# Jelentkezések feldolgozása
for group in collection.find():
    applications = group["applications"]

    threshold_index = int(len(applications) * global_admission_rate)
    threshold_score = applications[threshold_index]["score"]

    for application in applications:
        if application["distance"] >= 20 and application["previously_denied"]:
            denied_applications.append(application)

        elif application["score"] >= threshold_score or application["social_quota_admission"]:
            application["accepted"] = True
            accepted_applications.append(application)

        else:
            application["accepted"] = False
            application["waiting_list_score"] = threshold_score - application["score"]
            waiting_list_applications.append(application)

    collection.update_one({"_id": group["_id"]}, {"$set": {"applications": applications, \
                                                           "threshold_score": threshold_score}})

# Elfogadott jelentkezések feldolgozása
accepted_applications.sort(key=lambda x: x["score"], reverse=True)
for application in accepted_applications:
    for i in range(len(dormitories)):
        if len(dormitories[application["dormitory_order"][i]]["applications"]) < single_dormitory_capacity:
            dormitories[application["dormitory_order"][i]]["applications"].append(application)
            break

# TODO: eredmények tárolása, esetleg CSV fájlba mentés
waiting_list = sorted(denied_applications, key=lambda x: x.get("waiting_list_score", 0), reverse=True)

print(dormitories)
print(waiting_list)
print(denied_applications)

# Kapcsolat lezárása
client.close()