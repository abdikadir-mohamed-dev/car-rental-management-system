"""
Copy data from the local sqlite database into the already-migrated
Neon Postgres database, mapping old column names/structure to the
CURRENT models (schema drifted after the sqlite file was created).

Usage:
    export DATABASE_URL="your-neon-connection-string"
    python3 migrate_sqlite_to_neon.py
"""

import os
import sqlite3
import sys

import psycopg2
from psycopg2.extras import execute_values

SQLITE_PATH = os.environ.get("SQLITE_PATH", "instance/crms_db.sqlite3")
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: set DATABASE_URL to your Neon connection string first.")
    sys.exit(1)


def insert_rows(pcur, pconn, table, columns, rows):
    if not rows:
        print(f"  {table}: 0 rows, skipping")
        return
    col_list = ", ".join(f'"{c}"' for c in columns)
    query = f'INSERT INTO "{table}" ({col_list}) VALUES %s ON CONFLICT DO NOTHING'
    try:
        execute_values(pcur, query, rows)
        pconn.commit()
        print(f"  {table}: copied {len(rows)} rows")
    except Exception as e:
        pconn.rollback()
        print(f"  {table}: FAILED - {e}")


def main():
    sconn = sqlite3.connect(SQLITE_PATH)
    sconn.row_factory = sqlite3.Row
    scur = sconn.cursor()

    pconn = psycopg2.connect(DATABASE_URL)
    pcur = pconn.cursor()

    # 1. users
    scur.execute("SELECT * FROM users")
    rows = scur.fetchall()
    if rows:
        cols = rows[0].keys()
        insert_rows(
            pcur, pconn, "users", cols, [tuple(r[c] for c in cols) for r in rows]
        )
    else:
        print("  users: 0 rows, skipping")

    # 2. customers (and build id -> user_id map)
    scur.execute("SELECT * FROM customers")
    cust_rows = scur.fetchall()
    customer_id_to_user_id = {}
    if cust_rows:
        cols = cust_rows[0].keys()
        insert_rows(
            pcur,
            pconn,
            "customers",
            cols,
            [tuple(r[c] for c in cols) for r in cust_rows],
        )
        for r in cust_rows:
            customer_id_to_user_id[r["id"]] = r["user_id"]
    else:
        print("  customers: 0 rows, skipping")

    # 3. drivers
    scur.execute("SELECT * FROM drivers")
    rows = scur.fetchall()
    if rows:
        cols = rows[0].keys()
        insert_rows(
            pcur, pconn, "drivers", cols, [tuple(r[c] for c in cols) for r in rows]
        )
    else:
        print("  drivers: 0 rows, skipping")

    # 4. staff — obsolete table
    scur.execute("SELECT * FROM staff")
    staff_rows = scur.fetchall()
    print(
        f"  staff: skipped ({len(staff_rows)} old rows) — table no longer exists in Postgres"
    )

    # 5. vehicles — plate_number -> registration_number, fuel_level -> fuel_type
    scur.execute("SELECT * FROM vehicles")
    rows = scur.fetchall()
    if rows:
        cols = [
            "id",
            "registration_number",
            "model",
            "mileage",
            "fuel_type",
            "status",
            "assigned_driver_id",
            "created_at",
        ]
        values = [
            (
                r["id"],
                r["plate_number"],
                r["model"],
                r["mileage"],
                r["fuel_level"],
                r["status"],
                r["assigned_driver_id"],
                r["created_at"],
            )
            for r in rows
        ]
        insert_rows(pcur, pconn, "vehicles", cols, values)
    else:
        print("  vehicles: 0 rows, skipping")

    # 6. trips — MUST BE BEFORE BOOKINGS so trip_id FK exists
    scur.execute("SELECT * FROM trips")
    rows = scur.fetchall()
    if rows:
        cols = rows[0].keys()
        insert_rows(
            pcur, pconn, "trips", cols, [tuple(r[c] for c in cols) for r in rows]
        )
    else:
        print("  trips: 0 rows, skipping")

    # 7. bookings — customer_id -> user_id, date/amount -> pickup_date/total_amount
    scur.execute("SELECT * FROM bookings")
    rows = scur.fetchall()
    if rows:
        cols = [
            "id",
            "user_id",
            "vehicle_id",
            "trip_id",
            "pickup_location",
            "pickup_date",
            "total_amount",
            "status",
            "created_at",
        ]
        values = []
        skipped = 0
        for r in rows:
            user_id = customer_id_to_user_id.get(r["customer_id"])
            if user_id is None:
                skipped += 1
                continue
            values.append(
                (
                    r["id"],
                    user_id,
                    r["vehicle_id"],
                    r["trip_id"],
                    r["pickup_location"],
                    r["date"],
                    r["amount"],
                    r["status"],
                    r["created_at"],
                )
            )
        if skipped:
            print(f"  bookings: {skipped} rows skipped (unresolvable customer_id)")
        insert_rows(pcur, pconn, "bookings", cols, values)
    else:
        print("  bookings: 0 rows, skipping")

    # 8. payments — obsolete structure in SQLite
    scur.execute("SELECT * FROM payments")
    payment_rows = scur.fetchall()
    print(
        f"  payments: skipped ({len(payment_rows)} old rows) — driver payouts non-mappable"
    )

    # 9. notifications — body -> message, cast read (0/1) to bool
    scur.execute("SELECT * FROM notifications")
    rows = scur.fetchall()
    if rows:
        cols = ["id", "user_id", "title", "message", "read", "created_at"]
        values = [
            (
                r["id"],
                r["user_id"],
                r["title"],
                r["body"],
                bool(r["read"]),
                r["created_at"],
            )
            for r in rows
        ]
        insert_rows(pcur, pconn, "notifications", cols, values)
    else:
        print("  notifications: 0 rows, skipping")

    # 10-11. maintenance, earnings
    for table in ["maintenance", "earnings"]:
        scur.execute(f"SELECT * FROM {table}")
        rows = scur.fetchall()
        if rows:
            cols = rows[0].keys()
            insert_rows(
                pcur, pconn, table, cols, [tuple(r[c] for c in cols) for r in rows]
            )
        else:
            print(f"  {table}: 0 rows, skipping")

    # Reset sequences so new auto-increment IDs don't collide
    for table in [
        "users",
        "customers",
        "drivers",
        "vehicles",
        "bookings",
        "notifications",
        "trips",
        "maintenance",
        "earnings",
    ]:
        try:
            pcur.execute(
                f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), "
                f"COALESCE((SELECT MAX(id) FROM {table}), 1))"
            )
            pconn.commit()
        except Exception:
            pconn.rollback()

    scur.close()
    sconn.close()
    pcur.close()
    pconn.close()
    print("Migration finished successfully.")


if __name__ == "__main__":
    main()
