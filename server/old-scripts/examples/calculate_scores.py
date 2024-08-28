# ennél biztosan komplexebb lesz, viszont valós adatok nélül felesleges egyelőre bonyolítanom, ezek csak az alap esetek
def calculate_score(application):
    # amennyiben a 2. félévét kezdi meg az adott hallgató, akkor a felvételi pontszám alapján számolunk
    if application["semester"] == 2:
        return application["admission_score"]

    # amennyiben a 3. félévét kezdi meg az adott hallgató, akkor csak 1 lezárt félévvel rendelkezik, ezért
    # az alapján számolunk (nem akartam bonyolítani, ezért a teszt adatok nem tartalmaznak olyan 2. féléves halgatót, aki rendelkezik lezárt félévvel)
    # TODO: az alábbi feltétel biztosan finomításra fog szorulni
    elif application["semester"] == 3:
        return application["scholarship_index1"]

    # 4-16. félévben az utolsó 2 lezárt félév ösztöndíj indexe alapján számolunk
    return round((application["scholarship_index1"] + application["scholarship_index2"]) / 2, 2)