import sys

from flask import Flask, request
from functions import create, deposit, withdraw, transfer, transact, init

app = Flask(__name__)
app.config["DEBUG"] = True

# Create Transaction
@app.route('/', methods=['GET'])
def test():
    db = requests.get("http://admin:password@couch:5984/accounts")


    if db.status_code == 404:
        create_accounts()
        db = requests.get("http://admin:password@couch:5984/accounts")


    print(f"DEBUG: db={db}", file=sys.stderr)
    print(f"DEBUG: status code={db.status_code}", file=sys.stderr)
    return {"value": db.json()}

@app.route('/create', methods=['POST'])
def createAccount():
    """
    Create an Account

    Usage:
        POST [host]/create?name="John"&balance=500
          - send a POST request to /create
          - include Param "name" to give the account a name
          - include Param "balance" to provide an initial balance (default 0)

    Returns (success):
      - ID of the created account
      - name and balance of the created account

    Returns (failure):
      - HTTP status code 500
    """

    response, status = create(name=request.values['name'], balance=float(request.values['balance']) )

    return response, status

@app.route('/deposit/<account>', methods=['PUT'])
def depositAmt(account):
    """
    Deposit an amount to an account

    Usage:
        PUT [host]/deposit/<account>?amount=<deposit amount>
          - send a PUT request to /deposit/<account number>
          - include Param "amount" to provide the amount to deposit
                eg: PUT localhost:5000/deposit/20?amount=500
                    withdraws $500 from account 20

    Returns (success):
      - name, updated balance, and id of the updated account
      - HTTP status code 200

    Returns (failure):
      - HTTP status code 500
    """
    response, status = deposit( account, float(request.values['amount']) )
    return response, status

@app.route('/withdraw/<account>', methods=['PUT'])
def withdrawAmt(account):
    """
    Withdraw an amount to an account

    Usage:
        PUT [host]/withdraw/<account>?amount=<withdraw amount>
          - send a PUT request to /withdraw/<account number>
          - include Param "amount" to provide the amount to withdraw
                eg: PUT localhost:5000/withdraw/20?amount=500
                    deposits $500 to account 20

    Returns (success):
      - name, updated balance, and id of the updated account
      - HTTP status code 200

    Returns (failure):
      - HTTP status code 500
    """
    response, status = withdraw( account, float(request.values['amount']) )
    return response, status

@app.route('/transfer/<to_acc>/<from_acc>', methods=['PUT'])
def transferToFrom(to_acc, from_acc):
    """
    Transfer an amount from one account to another

    Usage:
        PUT [host]/transfer/<deposit_account>/<withdraw_account>?amount=<withdraw amount>
          - send a PUT request to /transfer/<account number>
          - include Param "amount" to provide the amount to transfer
                eg: PUT localhost:5000/transfer/20/5?amount=500
                    Sends $500 from account 5 to account 20

    Returns (success):
      - name, updated balance, and id of both updated accounts
      - HTTP status code 200

    Returns (failure):
      - HTTP status code 500
    """
    amount = request.values['amount']
    return {"to": to_acc, "from": from_acc, "amt": amount, "request": request.values}, 200

@app.route('/transact', methods=['PUT', 'POST'])
def processTransaction():
    """
    Withdraw an amount to an account

    This node will double-check to ensure the amounts are correct, and if not re

    Usage:
        PUT [host]/transact
          - send a PUT request to /transact with the transaction as params or json data

    Returns (success):
      - HTTP status code 200
      - The list of updated account ids, names, and balances

    Returns (failure):
      - HTTP status code 400 ( if sum(withdraws) != sum(deposits) )
      - HTTP status code 500
    """
    return {"request": request.values}, 200



init()

app.run()
