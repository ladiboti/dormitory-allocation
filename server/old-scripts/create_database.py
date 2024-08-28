import pandas as pd
from pymongo import MongoClient

# Excel fájl beolvasása DataFrame-be
file_path = 'data/merged_data.xlsx'
df = pd.read_excel(file_path)

print(df.columns)

# MongoDB csatlakozási paraméterek
client = MongoClient('mongodb://localhost:27017/')
db = client['dormitory']  # Adatbázis kiválasztása
collection = db['students']  # Gyűjtemény kiválasztása

# Töröl minden meglévő dokumentumot a gyűjteményből
collection.delete_many({})

# Végigiterál minden soron a DataFrame-ben és beilleszti azokat a MongoDB gyűjteménybe
for index, row in df.iterrows():
    if row["Félév_next"] == 2:
        score = -1
    elif row["Félév_next"] == 3:
        score = row["Ösztöndíjindex"]
    else:
        score = round((row["Ösztöndíjindex"] + row["Ösztöndíjindex_next"]) / 2, 2)

    # TODO: missing records!!!!!!!!!!
    # szoc külön lista a várólistások közül
        
    # két félév passzív után elsős
    # távolság hiba
    # nincs hallgatói jogviszony aleadott képzésen
    # rossz képzésen adta le a jelentkezést
    # rossz jelentkezési ciklus
    # rossz képzési hely
    

    document = {
        "neptun": row["Neptun kód"],
        "key": row["Kulcs"],
        "semester": row["Szemeszter_next"],
        "admission_unit": row["Kulcs"][6:],
        "dormitory_order": ["PE-HJ", "PE-JE", "PE-KP", "PE-MA-2", "PE-MA-22"],
        "previously_denied": False,
        "social_quota_admission": False,
        "address": None,
        "accepted": None,
        "distance": 21,
        "score": score
    }
    collection.insert_one(document)

# Kapcsolat lezárása
client.close()

print("Data inserted into MongoDB and connection closed.")
