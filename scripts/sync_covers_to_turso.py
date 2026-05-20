#!/usr/bin/env python3
"""
Sync cover_url values from local SQLite to Turso.
Run after fetch_covers.py has populated the local DB.
Run from the project root: python3 scripts/sync_covers_to_turso.py
"""

import sqlite3
import subprocess
import sys
import tempfile
import os

DB_PATH = "data/vinyl.db"
TURSO_DB = "vinyl-collection"
TURSO_BIN = os.path.expanduser("~/.turso/turso")


def main():
    db = sqlite3.connect(DB_PATH)
    rows = db.execute(
        "SELECT id, cover_url FROM records WHERE cover_url != ''"
    ).fetchall()
    db.close()

    if not rows:
        print("No cover URLs found in local DB. Run fetch_covers.py first.")
        sys.exit(1)

    print(f"Syncing {len(rows)} cover URLs to Turso...")

    sql_lines = []
    for rid, cover_url in rows:
        escaped = cover_url.replace("'", "''")
        sql_lines.append(f"UPDATE records SET cover_url = '{escaped}' WHERE id = {rid};")

    sql = "\n".join(sql_lines)

    with tempfile.NamedTemporaryFile(mode="w", suffix=".sql", delete=False) as f:
        f.write(sql)
        tmp_path = f.name

    try:
        result = subprocess.run(
            [TURSO_BIN, "db", "shell", TURSO_DB],
            input=sql,
            text=True,
            capture_output=True,
        )
        if result.returncode != 0:
            print("Error:", result.stderr)
            sys.exit(1)
        print(f"Done. Synced {len(rows)} cover URLs to Turso.")
    finally:
        os.unlink(tmp_path)


if __name__ == "__main__":
    main()
