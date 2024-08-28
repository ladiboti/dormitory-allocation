import pandas as pd
import random
import string
import numpy as np
import sys

# List of dormitories
dormitories = ["PE-HJ", "PE-JE", "PE-KP", "PE-MA-2", "PE-MA-22"]

# Read the Excel file
file_path = 'examples/fe_kod.xlsx'
df = pd.read_excel(file_path)

# Extract unique Modul kód values
unique_felveteli_egyseg = df['Felvételi egység'].unique()

# Function to generate a random application
def generate_application():
    neptun = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    semester = random.randint(2, 15)
    felveteli_egyseg = random.choice(unique_felveteli_egyseg)
    scholarship_index = round(np.random.normal(4.0, 2.0), 2)
    new_row = {
        "Neptun kód": neptun,
        "Felvétel dátuma": "",
        "Hallgató képzése": "",
        "Nyomdai kód": "",
        "Pénzügyi státusz ID": "",
        "Pénzügyi státusz2 ID": "",
        "Státusz ID": "",
        "Státusz2 ID": "",
        "Félév": "2022/23/1",
        "Kredit index": "",
        "KreditIndex": "",
        "KumElismertKredit": "",
        "Összes felvett kredit": "",
        "Összes teljesített kredit": "",
        "Összesített kredit index": "",
        "Összesített súlyozott átlag": "",
        "Ösztöndíjindex": scholarship_index,
        "Pénzügyi státusz": "",
        "Pénzügyi státusz2": "",
        "Státusz": "",
        "Státusz2": "",
        "Szemeszter": semester,
        "Tagozat": "",
        "Modul kód": "",
        "Nem": "",
        "Nyomtatási név": "",
        "Egyén oktatási azonosító": "",
        "Telephely neve": "",
        "Kulcs": neptun + felveteli_egyseg
    }
    return new_row

# Number of iterations from command-line arguments
num_iterations = int(sys.argv[1]) if len(sys.argv) > 1 else 10

# Generate the missing data
new_data = [generate_application() for _ in range(num_iterations)]

# Create a new DataFrame with the generated data
new_df = pd.DataFrame(new_data)

# Save to a new Excel file
output_file_path = 'data/generated_test_students.xlsx'
new_df.to_excel(output_file_path, index=False)

print(f"Data generated and saved to {output_file_path}.")

# Function to create dormitory rankings
def create_dormitory_rankings(input_file_path, output_file_path):
    # Read the generated data
    df = pd.read_excel(input_file_path)

    # Extract unique Neptun codes
    unique_neptun_codes = df['Neptun kód'].unique()

    # Create a DataFrame to store the rankings
    rankings_df = pd.DataFrame(unique_neptun_codes, columns=['Neptun kód'])

    # Generate random rankings for each dormitory in each row
    for i in range(len(unique_neptun_codes)):
        random_ranks = list(range(1, len(dormitories) + 1))
        random.shuffle(random_ranks)
        for j, dorm in enumerate(dormitories):
            rankings_df.at[i, dorm] = random_ranks[j]

    # Save the rankings to a new Excel file
    rankings_df.to_excel(output_file_path, index=False)
    print(f"Dormitory rankings saved to {output_file_path}.")

# Call the function to create dormitory rankings
rankings_output_path = 'data/neptun_kod_rankings.xlsx'
create_dormitory_rankings(output_file_path, rankings_output_path)

# Function to create the next semester's data
def create_next_semester_data(input_file_path, output_file_path):
    # Read the generated data
    df = pd.read_excel(input_file_path)

    # Generate new scholarship index and increase semester
    df['Ösztöndíjindex'] = [round(np.random.normal(4.0, 2.0), 2) for _ in range(len(df))]
    df['Szemeszter'] = df['Szemeszter'] + 1
    df['Félév'] = "2022/23/2"

    # Ensure only relevant columns are kept, others are dropped
    columns_to_keep = ['Neptun kód', 'Ösztöndíjindex', 'Szemeszter', 'Félév', 'Kulcs']
    df = df[columns_to_keep]

    # Save to a new Excel file
    df.to_excel(output_file_path, index=False)
    print(f"Next semester data saved to {output_file_path}.")

# Call the function to create the next semester's data
next_semester_output_path = 'data/generated_test_students_next_semester.xlsx'
create_next_semester_data(output_file_path, next_semester_output_path)

# File paths
file1_path = 'data/generated_test_students.xlsx'
file2_path = 'data/generated_test_students_next_semester.xlsx'
file3_path = 'data/neptun_kod_rankings.xlsx'

# Read the Excel files
df1 = pd.read_excel(file1_path)
df2 = pd.read_excel(file2_path)
df3 = pd.read_excel(file3_path)

# Merge file1 and file2 on 'Kulcs' column
merged_df1_2 = pd.merge(df1, df2, on='Kulcs', suffixes=('', '_next'))

# Merge the result with file3 on 'Neptun kód' column
final_df = pd.merge(merged_df1_2, df3, on='Neptun kód')

# Save the final merged DataFrame to a new Excel file
output_file_path = 'data/merged_data.xlsx'
final_df.to_excel(output_file_path, index=False)

print(f"Data merged and saved to {output_file_path}.")