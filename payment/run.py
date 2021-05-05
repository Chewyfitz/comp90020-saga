import flask
import uuid
import sys
import requests

app = flask.Flask(__name__)
app.config["DEBUG"] = True

def create_accounts():
    requests.put("http://admin:password@couch:5984/accounts")

# Create Transaction
@app.route('/', methods=['GET'])
def test():
    #uid = uuid.uuid1()
    #print(f"DEBUG: uid={uid}", file=sys.stderr)
    db = requests.get("http://admin:password@couch:5984/accounts")


    if db.status_code == 404:
        create_accounts()


    print(f"DEBUG: db={db}", file=sys.stderr)
    print(f"DEBUG: status code={db.status_code}", file=sys.stderr)
    return {"value": db.json()}

app.run()
