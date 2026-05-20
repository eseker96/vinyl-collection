import pandas as pd
import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'data', 'vinyl.db')
xl = pd.read_excel('/Users/esekerli/Downloads/Records.xlsx', sheet_name=None)

def clean_str(val):
    if pd.isna(val):
        return ''
    return str(val).strip()

def clean_year(val):
    if pd.isna(val):
        return ''
    try:
        return str(int(float(val)))
    except (ValueError, TypeError):
        return str(val).strip()

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Current collection (owned)
current = xl['Current'][['Title', 'Artist', 'Year', 'Genre']].copy()
owned_rows = []
for _, row in current.iterrows():
    title = clean_str(row['Title'])
    artist = clean_str(row['Artist'])
    if not title or not artist:
        continue
    owned_rows.append((title, artist, clean_str(row['Genre']), clean_year(row['Year']), '', 'owned', ''))

cur.executemany(
    'INSERT INTO records (title, artist, genre, year, notes, type, owner) VALUES (?,?,?,?,?,?,?)',
    owned_rows
)
print(f"Imported {len(owned_rows)} owned records")

# Ece Wishlist
ece = xl['Ece Wishlist'][['Title', 'Artist', 'Year', 'Genre']].copy()
ece_rows = []
for _, row in ece.iterrows():
    title = clean_str(row['Title'])
    artist = clean_str(row['Artist'])
    if not title or not artist:
        continue
    ece_rows.append((title, artist, clean_str(row['Genre']), clean_year(row['Year']), '', 'wishlist', 'Ece'))

cur.executemany(
    'INSERT INTO records (title, artist, genre, year, notes, type, owner) VALUES (?,?,?,?,?,?,?)',
    ece_rows
)
print(f"Imported {len(ece_rows)} Ece wishlist records")

# Renke Wishlist — rows 0-23 are correct, rows 24+ have Title/Artist swapped
renke = xl['Renke Wishlist'][['Title', 'Artist', 'Year', 'Genre']].copy()
renke_rows = []
for i, row in renke.iterrows():
    if i >= 24:
        # Columns are swapped: Title col = artist, Artist col = title
        title = clean_str(row['Artist'])
        artist = clean_str(row['Title'])
        # Fix typos in artist names
        if artist.lower() in ('atlin gün', 'altin gün'):
            artist = 'Altin Gün'
    else:
        title = clean_str(row['Title'])
        artist = clean_str(row['Artist'])

    if not title or not artist:
        continue
    renke_rows.append((title, artist, clean_str(row['Genre']), clean_year(row['Year']), '', 'wishlist', 'Renke'))

cur.executemany(
    'INSERT INTO records (title, artist, genre, year, notes, type, owner) VALUES (?,?,?,?,?,?,?)',
    renke_rows
)
print(f"Imported {len(renke_rows)} Renke wishlist records")

conn.commit()
conn.close()
print("Done.")
