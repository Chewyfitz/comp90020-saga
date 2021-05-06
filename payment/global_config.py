import os

db_username = os.environ.get('USER') or "admin"
db_password = os.environ.get('PASS') or "password"

root = f"http://{db_username}:{db_password}@couch:5984"
