import requests
import os
import json

def init():
    create_accounts()
    create_transactions()

db_username = os.environ.get('USER') or "admin"
db_password = os.environ.get('PASS') or "password"

root = f"http://{db_username}:{db_password}@couch:5984"

################################################################################
#                               Utility Functions                              #

def create_accounts():
    requests.put(f"{root}/accounts")

def create_transactions():
    requests.put(f"{root}/transactions")

def get_account(id:str):
    # Get the current document
    res = requests.get(f"{root}/accounts/{id}")
    return (res.json(), res.status_code)


################################################################################
#                            External-facing Functions                         #
def create(name:str, balance:float = 0):

    data = {"name": name, "balance":balance}

    res = requests.post(f"{root}/accounts", json=data)

    data['id'] = res.json()['id']
    
    return (data, res.status_code)

def deposit(id:str, amount:float = 0):
    if amount == 0:
        return ({"Error": "Deposit amount requred."}, 400)

    # Get the current document
    update, status = get_account(id)

    # Construct the update (increase the balance)
    update['balance'] = round(update['balance'] + amount, 2)

    # PUT the updated balance into the database
    res = requests.put(f"{root}/accounts/{id}", data=json.dumps(update) )

    # Clear out unnecessary fields for retransmission
    del update['_rev']
    update['id'] = update['_id']
    del update['_id']

    # respond
    return (update, res.status_code)

def withdraw(id:str, amount:float = 0):
    if amount == 0:
        return ({"Error": "Withdrawal amount requred."}, 400)

    # Get the current document
    update, status = get_account(id)

    if round(update['balance'] - amount, 2) < 0:
        return ({"Error": "Cannot overdraw account."}, 400)

    # Construct the update (decrease the balance)
    update['balance'] = round(update['balance'] - amount, 2)

    # PUT the updated balance into the database
    res = requests.put(f"{root}/accounts/{id}", data=json.dumps(update) )

    # Clear out unnecessary fields for retransmission
    del update['_rev']
    update['id'] = update['_id']
    del update['_id']

    # respond
    return (update, res.status_code)

def transfer(source:str, dest:str, amount:float=0):
    if amount == 0:
        return ({"Error": "Transfer amount requred."}, 400)
    return 0

def transact(transactions):
    # TODO: Parse list of transactions
    # TODO: Validate parsed list of transactions
    # TODO: Perform transactions
    return 0
