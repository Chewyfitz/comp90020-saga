import requests
from global_config import root

def init():
    create_accounts()
    create_transactions()

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
def create(name:str, balance:float = 0, id:str=None):

    data = {"name": name, "balance":balance}

    if id:
        res = requests.put(f"{root}/accounts/{id}", json=data)
    else:    
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
    res = requests.put(f"{root}/accounts/{id}", json=update)

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
    res = requests.put(f"{root}/accounts/{id}", json=update )

    # Clear out unnecessary fields for retransmission
    del update['_rev']
    update['id'] = update['_id']
    del update['_id']

    # respond
    return (update, res.status_code)

def transfer(source:str, dest:str, amount:float=0):
    if amount == 0:
        return ({"Error": "Transfer amount requred."}, 400)

    src0, status0 = get_account(source)
    if status0 != 200:
        return ({"Error": "Source account not found."}, 500)
    if src0['balance'] < amount:
        return ({"Error": "Source account balance insufficient."}, 400)

    src1, status1 = get_account(dest)
    if status1 != 200:
        return ({"Error": "Source account not found."}, 500)

    res = requests.post(
        f"{root}/transactions", 
        json={"from": source, "to": dest, "amount":amount})

    acc1, status1 = withdraw(source, amount)
    acc2, status2 = deposit(dest, amount)

    if status1 == status2 and status1 == 201:
        return ({"from": acc1, "to": acc2, "amount":amount}, 200)
    # Don't ask what the plan is if this *doesn't* work...

    return ({"Error": "Unknown internal server error."}, 500)

def transact(source, destinations):
    # Get total withdrawal amount
    amount = 0
    for dest in destinations:
        amount += dest['amount']

    # Check that balance is sufficient before running transaction
    src, status = get_account(source)
    if status != 200:
        return ({"Error": "Source account not found."}, 500)
    if src['balance'] < amount:
        return ({"Error": "Source account balance insufficient."}, 400)

    summary = {}

    # Perform transactions
    for i, dest in enumerate(destinations):
        summary[i], _ = transfer(source, dest['dest'], dest['amount'])

    # Not sure what to return here, maybe the summary of all accounts?
    # TODO: Figure out what to return here
    return (summary, 200)
