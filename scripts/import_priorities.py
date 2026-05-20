#!/usr/bin/env python3
"""
Import priority values from Records.xlsx into local SQLite, then sync to Turso.
Run from the project root: python3 scripts/import_priorities.py
"""

import sqlite3
import subprocess
import os
import openpyxl

DB_PATH = "data/vinyl.db"
EXCEL_PATH = os.path.expanduser("~/Downloads/Records.xlsx")
TURSO_BIN = os.path.expanduser("~/.turso/turso")
TURSO_DB = "vinyl-collection"

VALID = {"High", "Medium", "Low"}


def normalize(val):
    if not val:
        return "Medium"
    s = str(val).strip().capitalize()
    return s if s in VALID else "Medium"


def main():
    wb = openpyxl.load_workbook(EXCEL_PATH)
    db = sqlite3.connect(DB_PATH)

    updates = []
    for sheet, owner in [("Ece Wishlist", "Ece"), ("Renke Wishlist", "Renke")]:
        ws = wb[sheet]
        rows = list(ws.iter_rows(min_row=2, values_only=True))
        # Detect swapped title/artist (same fix as original import: rows 24+ in Renke)
        for i, row in enumerate(rows):
            title, artist, year, genre, typ, priority = (list(row) + [None] * 6)[:6]
            if not title:
                continue
            if sheet == "Renke Wishlist" and i >= 23:
                title, artist = artist, title
            priority = normalize(priority)
            updates.append((priority, str(title).strip(), owner))

    updated = 0
    for priority, title, owner in updates:
        cur = db.execute(
            "UPDATE records SET priority = ? WHERE title = ? AND owner = ? AND type = 'wishlist'",
            (priority, title, owner),
        )
        updated += cur.rowcount

    db.commit()
    db.close()
    print(f"Updated {updated} wishlist records with priority values.")

    # Sync to Turso
    db2 = sqlite3.connect(DB_PATH)
    rows = db2.execute(
        "SELECT id, priority FROM records WHERE type = 'wishlist'"
    ).fetchall()
    db2.close()

    sql = "\n".join(
        f"UPDATE records SET priority = '{p}' WHERE id = {rid};"
        for rid, p in rows
    )
    result = subprocess.run(
        [TURSO_BIN, "db", "shell", TURSO_DB],
        input=sql, text=True, capture_output=True,
    )
    if result.returncode != 0:
        print("Turso sync error:", result.stderr)
    else:
        print(f"Synced {len(rows)} priority values to Turso.")


if __name__ == "__main__":
    main()
