from flask import Flask, request
from flask_restful import Api, Resource
import json

app = Flask(__name__)
api = Api(app)

'''
Cases to worry about:
-microservice fails
-SEC fails and starts back up where it left off. How does it know who to send the result back to? 
Should front end just get a 'failed' and when SEC comes back, it just compensates anything it finds unfinished?
-concurrency with the log if multiple posts.

NOTE: currently using just a txt file as the SAGA log. This may cause issues. may need a database?

You can test this by running test.py while the SEC is up. Make sure the log.json only has {} in it. 
'''
FLIGHT_URL = "http://127.0.0.1:5001/"
HOTEL_URL = "http://127.0.0.1:5002/"
PAYMENT_URL = "http://127.0.0.1:5003/"

def addLog(trip, key, msg=True):
    with open('api/log.json', 'r') as f:
        log = json.load(f)
    log[trip['tripID']][key] = msg
    with open('api/log.json', 'w') as f:
        json.dump(log, f)

def departflightsBook(trip):
    flight = trip['departFlight']
    try:
        response = requests.put(FLIGHT_URL + 'bookings/' + flight['id'], json={"user": flight['user'], "flight": flight['flight']})
        result = response.json()['ok']
    except:
        result = False
    if result:
        addLog(trip,'departflightsEnd')
        return True
    else:
        addLog(trip, 'departflightsAbort')
        return False

def returnflightsBook(trip):
    flight = trip['returnFlight']
    try:
        response = requests.put(FLIGHT_URL + 'bookings/' + flight['id'], json={"user": flight['user'], "flight": flight['flight']})
        result = response.json()['ok']
    except:
        result = False
    if result:
        addLog(trip,'returnflightsEnd')
        return True
    else:
        addLog(trip, 'returnflightsAbort')
        return False

def hotelBook(trip):
    hotel = trip['hotel']
    try:
        response = requests.put(HOTEL_URL + 'bookings/' + hotel['bookingid'], json={"user": hotel['name'], "hotel": hotel['hotelid'], "start": hotel['start'], "end": hotel['end']})
        result = response.json()['ok']
    except:
        result = False
    if result:
        addLog(trip,'hotelEnd')
        return True
    else:
        addLog(trip, 'hotelAbort')
        return False

def paymentBook(trip):
    payment = trip['payment']
    try:
        response = requests.post(PAYMENT_URL + 'transact/', json={"source": payment['source'], "destinations": {"destinationid": payment['destinations'][0]['destinationid'], "amount": payment['destinations'][0]['amount']}})
        result = response.json()['ok']
    except:
        result = False
    if result:
        addLog(trip,'paymentEnd')
        return True
    else:
        addLog(trip, 'paymentAbort')
        return False

def departflightsComp(trip):
    flight = trip['departFlight']
    try:
        response = requests.delete(FLIGHT_URL + 'bookings/' + flight['id'])
        result = response.json()['ok']
    except:
        result = False 
    addLog(trip, 'departflightsAbort')

def returnflightsComp(trip):
    flight = trip['returnFlight']
    try:
        response = requests.delete(FLIGHT_URL + 'bookings/' + flight['id'])
        result = response.json()['ok']
    except:
        result = False 
    addLog(trip, 'returnflightsAbort')

def hotelComp(trip):
    hotel = trip['hotel']
    try:
        response = requests.delete(HOTEL_URL + 'bookings/' + hotel['bookingid'])
        result = response.json()['ok']
    except:
        result = False
    addLog(trip, 'hotelAbort')

def paymentComp(trip):
    payment = trip['payment']
    try:
        response = requests.put(PAYMENT_URL + 'transfer/'+payment['destinations'][0]['destinationid']+'/'+payment['source'])
        result = response.json()['ok']
    except:
        result = False 
    addLog(trip, 'paymentAbort')

def compensateSaga(trip):
    with open('api/log.json', 'r') as f:
        log = json.load(f)
    
    if not ('departflightsStart' not in log[trip['tripID']] or 'departflightsAbort' in log[trip['tripID']]):
        departflightsComp(trip)

    if not ('returnflightsStart' not in log[trip['tripID']] or 'returnflightsAbort' in log[trip['tripID']]):
        returnflightsComp(trip)

    if not ('hotelStart' not in log[trip['tripID']] or 'hotelAbort' in log[trip['tripID']]):
        hotelComp(trip)

    if not ('paymentStart' not in log[trip['tripID']] or 'paymentAbort' in log[trip['tripID']]):
        paymentComp(trip)
    
    addLog(trip, 'end', False)


def saga(trip):
        with open('api/log.json', 'r') as f:
            log = json.load(f)
        
        if trip['tripID'] not in log:
            log[trip['tripID']] = {'start': True}
            with open('api/log.json', 'w') as f:
                json.dump(log, f)
        
        if 'end' in log[trip['tripID']]:
            return log[trip['tripID']]['end'] #True or False

        if 'departFlight' in trip:
            addLog(trip,'departflightsStart')
            result = departflightsBook(trip)
            if not result:
                compensateSaga(trip)
                return False

        if 'returnFlight' in trip:
            addLog(trip,'returnflightsStart')
            result = returnflightsBook(trip)
            if not result:
                compensateSaga(trip)
                return False

        if 'hotel' in trip:
            addLog(trip,'hotelStart')
            result = hotelBook(trip)
            if not result:
                compensateSaga(trip)
                return False

        #Payment will always be present
        addLog(trip,'paymentStart')
        paymentBook(trip)

        addLog(trip, 'end')

        return True

#On startup, it goes through log to see if sagas are unfinished, and compensates
def logCheck():
    with open('api/log.json', 'r') as f:
        log = json.load(f)
    for tripID in log.keys():
        if 'end' not in log[tripID]:
            trip = {'tripID':tripID}
            compensateSaga(trip)

class SEC(Resource):

    def post(self):
        trip = request.get_json()
        res = saga(trip)
        return {'ok': res}

api.add_resource(SEC, '/')

app.run()

logCheck()

