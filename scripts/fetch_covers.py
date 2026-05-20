#!/usr/bin/env python3
"""
Fetch album cover art for all records using MusicBrainz + Cover Art Archive.
Stores cover_url in local data/vinyl.db.
Run from the project root: python3 scripts/fetch_covers.py
"""

import sqlite3
import time
import requests

DB_PATH = "data/vinyl.db"
HEADERS = {"User-Agent": "VinylArchive/1.0 (personal-use; ece.sekerli@gmail.com)"}
MB_SEARCH = "https://musicbrainz.org/ws/2/release/?query=release:{title} AND artist:{artist}&fmt=json&limit=5"
CAA_URL = "https://coverartarchive.org/release/{mbid}/front-250"
DISCOGS_SEARCH = "https://api.discogs.com/database/search?artist={artist}&release_title={title}&type=release&per_page=5"


def find_cover_musicbrainz(title: str, artist: str) -> str:
    try:
        url = MB_SEARCH.format(
            title=requests.utils.quote(f'"{title}"'),
            artist=requests.utils.quote(f'"{artist}"'),
        )
        r = requests.get(url, headers=HEADERS, timeout=10)
        r.raise_for_status()
        releases = r.json().get("releases", [])
    except Exception as e:
        print(f"  MB error: {e}")
        return ""

    for release in releases:
        mbid = release.get("id", "")
        if not mbid:
            continue
        try:
            caa = requests.get(
                CAA_URL.format(mbid=mbid),
                headers=HEADERS,
                timeout=10,
                allow_redirects=True,
            )
            if caa.status_code == 200:
                return CAA_URL.format(mbid=mbid)
        except Exception:
            continue

    return ""


def find_cover_discogs(title: str, artist: str) -> str:
    # Search returns resource_url but not image URLs unless authenticated.
    # Fetching the release directly returns full images without auth.
    try:
        url = DISCOGS_SEARCH.format(
            artist=requests.utils.quote(artist),
            title=requests.utils.quote(title),
        )
        r = requests.get(url, headers=HEADERS, timeout=10)
        r.raise_for_status()
        results = r.json().get("results", [])
    except Exception as e:
        print(f"  Discogs search error: {e}")
        return ""

    for result in results:
        resource_url = result.get("resource_url", "")
        if not resource_url:
            continue
        try:
            time.sleep(2.5)  # rate limit between the two Discogs calls
            rel = requests.get(resource_url, headers=HEADERS, timeout=10)
            rel.raise_for_status()
            images = rel.json().get("images", [])
            for img in images:
                if img.get("type") == "primary" and img.get("uri150"):
                    return img["uri150"]
        except Exception:
            continue

    return ""


def find_cover(title: str, artist: str, skip_mb: bool = False) -> tuple[str, str]:
    """Try MusicBrainz/CAA first, then Discogs as fallback.
    Returns (cover_url, source) where source is 'mb', 'discogs', or ''.
    Caller is responsible for rate-limit sleeps."""
    if not skip_mb:
        cover = find_cover_musicbrainz(title, artist)
        if cover:
            return cover, "mb"

    cover = find_cover_discogs(title, artist)
    if cover:
        return cover, "discogs"

    return "", ""


def main():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row

    rows = db.execute(
        "SELECT id, title, artist FROM records WHERE cover_url = '' ORDER BY artist, title"
    ).fetchall()

    total = len(rows)
    found = 0
    print(f"Fetching covers for {total} records...\n")

    for i, row in enumerate(rows, 1):
        rid, title, artist = row["id"], row["title"], row["artist"]
        print(f"[{i}/{total}] {artist} — {title}", end=" ... ", flush=True)

        cover, source = find_cover(title, artist)

        if cover:
            db.execute("UPDATE records SET cover_url = ? WHERE id = ?", (cover, rid))
            db.commit()
            print(f"✓ ({source})")
            found += 1
        else:
            print("—")

        # Always sleep enough for the slowest API used (Discogs: 25 req/min)
        time.sleep(2.5)

    db.close()
    print(f"\nDone. Found covers for {found}/{total} records.")


if __name__ == "__main__":
    main()
